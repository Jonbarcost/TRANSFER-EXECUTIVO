import { isServed, quote } from '@/lib/pricing';
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
  const json = await res.json();
  return (json.features?.[0]?.properties?.legs?.[0] ?? null) as
    | { distance: number; time: number; steps: { toll?: boolean }[] }
    | null;
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

  let sameDay = false;
  let waitHours = 0;
  if (roundTrip) {
    const back = toDate(returnDate, returnTime);
    if (isNaN(back.getTime())) return fail('returnDate');
    const arrival = pickup.getTime() + maxMinutes * 60_000;
    if (back.getTime() <= arrival) return fail('returnBefore');
    sameDay = returnDate === date;
    waitHours = (back.getTime() - arrival) / 3_600_000;
  }

  return Response.json({
    km: Math.round(ride.distance / 100) / 10,
    minutes: { min: Math.round(Math.min(ride.time, traffic.time) / 60), max: maxMinutes },
    toll: ride.steps.some((s) => s.toll),
    price: quote({ meters: ride.distance, roundTrip: !!roundTrip, sameDay, waitHours }),
  });
}
