import { BASE, isServed, quote } from '@/lib/pricing';
import { SITE } from '@/lib/site';

type Point = { label: string; lat: number; lon: number; city?: string; state_code?: string };

const isPoint = (p: Point) => p && typeof p.lat === 'number' && typeof p.lon === 'number';
// Horário do RJ: -03:00 fixo (sem horário de verão).
const toDate = (date: string, time: string) => new Date(`${date}T${time}:00-03:00`);
const fail = (error: string, status = 400) => Response.json({ error }, { status });

// Uma rota com vários pontos: base → origem → destino → base. Devolve um trecho (leg) por par.
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
  return (json.features?.[0]?.properties?.legs ?? null) as
    | { distance: number; time: number; steps: { toll?: boolean }[] }[]
    | null;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return fail('Pedido inválido.');
  const { origin, destination, date, time, roundTrip, returnDate, returnTime, passengers } = body;

  if (!isPoint(origin) || !isPoint(destination)) return fail('Escolha origem e destino na lista de sugestões.');
  if (!isServed(origin, destination)) return fail('Atendemos saídas do estado do RJ ou de cidades que fazem divisa com o RJ, com destino no RJ.');
  if (!Number.isInteger(passengers) || passengers < 1 || passengers > SITE.maxPassengers)
    return fail(`Informe de 1 a ${SITE.maxPassengers} passageiros.`);

  const pickup = toDate(date, time);
  if (isNaN(pickup.getTime())) return fail('Informe data e horário.');
  if (pickup.getTime() < Date.now()) return fail('A data e o horário precisam ser no futuro.');

  const [free, traffic] = await Promise.all([
    route([BASE, origin, destination, BASE] as Point[], false),
    route([BASE, origin, destination, BASE] as Point[], true),
  ]);
  if (!free || !traffic || free.length !== 3) return fail('Não foi possível calcular a rota. Tente outro endereço.', 502);

  const ride = free[1];
  const legs = { a: free[0].distance, b: ride.distance, c: free[2].distance };
  const maxMinutes = Math.round(Math.max(ride.time, traffic[1].time) / 60);

  let sameDay = false;
  let waitHours = 0;
  if (roundTrip) {
    const back = toDate(returnDate, returnTime);
    if (isNaN(back.getTime())) return fail('Informe data e horário da volta.');
    const arrival = pickup.getTime() + maxMinutes * 60_000;
    if (back.getTime() <= arrival) return fail('A volta precisa ser depois da chegada ao destino.');
    sameDay = returnDate === date;
    waitHours = (back.getTime() - arrival) / 3_600_000;
  }

  return Response.json({
    km: Math.round(ride.distance / 100) / 10,
    minutes: { min: Math.round(Math.min(ride.time, traffic[1].time) / 60), max: maxMinutes },
    toll: ride.steps.some((s) => s.toll),
    price: quote({ legs, roundTrip: !!roundTrip, sameDay, waitHours }),
  });
}
