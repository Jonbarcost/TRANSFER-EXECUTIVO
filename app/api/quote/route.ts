import { isServed, quote, tollsOnRoute } from '@/lib/pricing';
import { SITE } from '@/lib/site';
import type { ErrorCode } from '@/lib/i18n';

type Point = { label: string; lat: number; lon: number; city?: string; state_code?: string };

const isPoint = (p: Point) => p && typeof p.lat === 'number' && typeof p.lon === 'number';
// Horário do RJ: -03:00 fixo (sem horário de verão).
const toDate = (date: string, time: string) => new Date(`${date}T${time}:00-03:00`);
// Devolve um código; o texto é traduzido no navegador.
const fail = (error: ErrorCode, status = 400) => Response.json({ error }, { status });

// Rota origem → destino.
async function route(points: Point[], traffic: boolean) {
  const params = new URLSearchParams({
    waypoints: points.map((p) => `${p.lat},${p.lon}`).join('|'),
    mode: 'drive',
    details: 'route_details',
    apiKey: process.env.GEOAPIFY_API_KEY ?? '',
  });
  if (traffic) params.set('traffic', 'approximated');
  const res = await fetch(`https://api.geoapify.com/v1/routing?${params}`);
  if (!res.ok) return null;
  const feature = (await res.json()).features?.[0];
  const leg = feature?.properties?.legs?.[0];
  if (!leg) return null;
  // Geometria em [lat, lon], na ordem da viagem (a API devolve [lon, lat]).
  const line: [number, number][] = (feature.geometry?.coordinates ?? []).flat().map(([lon, lat]: number[]) => [lat, lon]);
  return { ...(leg as { distance: number; time: number; steps: { toll?: boolean }[] }), line };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return fail('invalid');
  const { origin, destination, date, time, roundTrip, returnDate, returnTime, passengers } = body;

  if (!isPoint(origin) || !isPoint(destination)) return fail('pick');
  if (!isServed(origin, destination)) return fail('area');
  if (!Number.isInteger(passengers) || passengers < 1 || passengers > SITE.maxPassengers)
    return fail('passengers');

  const pickup = toDate(date, time);
  if (isNaN(pickup.getTime())) return fail('date');
  if (pickup.getTime() < Date.now()) return fail('past');

  const [ride, traffic] = await Promise.all([
    route([origin, destination], false),
    route([origin, destination], true),
  ]);
  if (!ride || !traffic) return fail('route', 502);

  const maxMinutes = Math.round(Math.max(ride.time, traffic.time) / 60);

  const go = tollsOnRoute(ride.line, pickup);
  let back = { total: 0, names: [] as string[] };
  let sameDay = false;
  let waitHours = 0;
  if (roundTrip) {
    const returnAt = toDate(returnDate, returnTime);
    if (isNaN(returnAt.getTime())) return fail('returnDate');
    const arrival = pickup.getTime() + maxMinutes * 60_000;
    if (returnAt.getTime() <= arrival) return fail('returnBefore');
    sameDay = returnDate === date;
    waitHours = (returnAt.getTime() - arrival) / 3_600_000;
    // A volta usa o mesmo caminho ao contrário (o sentido importa nas praças unidirecionais).
    back = tollsOnRoute([...ride.line].reverse(), returnAt);
  }
  const tolls = Math.round((go.total + back.total) * 100) / 100;
  const tollFlag = ride.steps.some((s) => s.toll);

  return Response.json({
    km: Math.round(ride.distance / 100) / 10,
    minutes: { min: Math.round(Math.min(ride.time, traffic.time) / 60), max: maxMinutes },
    tolls: { total: tolls, names: [...new Set([...go.names, ...back.names])] },
    // A rota tem trecho pedagiado que a tabela pode não cobrir (nenhuma praça achada ou fora do RJ).
    tollUnknown: tollFlag && (tolls === 0 || origin.state_code !== 'RJ' || destination.state_code !== 'RJ'),
    price: quote({ meters: ride.distance, roundTrip: !!roundTrip, sameDay, waitHours, tolls }),
  });
}
