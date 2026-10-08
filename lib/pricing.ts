// Única fonte de preços e regras de área. Valores confirmados pelo motorista em 2026-10-08.
// Cobra só o km do passageiro (origem → destino); o deslocamento vazio do motorista não entra.
export const PRICING = {
  perKm: 3.5, // R$ por km do passageiro
  minimumFare: 50, // R$ mínimo por trajeto
  waitPerHour: 40, // R$ por hora de espera (ida e volta no mesmo dia: o motorista espera)
  rangeSpread: 0.1, // faixa exibida: ±10% em torno do valor calculado
};

// Base do motorista: Copacabana (coordenada aproximada).
export const BASE = { lat: -22.9711, lon: -43.1863 };

// Cidades de outros estados aceitas como origem somente se o destino for no RJ:
// todos os municípios que fazem divisa com o RJ (malha municipal do IBGE).
const NEIGHBORS: Record<string, string[]> = {
  MG: [
    'Além Paraíba', 'Antônio Prado de Minas', 'Barão de Monte Alto', 'Belmiro Braga', 'Bocaina de Minas',
    'Caiana', 'Chiador', 'Estrela Dalva', 'Eugenópolis', 'Faria Lemos', 'Itamonte', 'Itanhandu', 'Palma',
    'Passa-Vinte', 'Patrocínio do Muriaé', 'Pirapetinga', 'Recreio', 'Rio Preto', 'Santa Bárbara do Monte Verde',
    'Santana do Deserto', 'Santa Rita de Jacutinga', 'Simão Pereira', 'Tombos', 'Volta Grande',
  ],
  SP: ['Arapeí', 'Areias', 'Bananal', 'Cunha', 'Queluz', 'São José do Barreiro', 'Ubatuba'],
  ES: [
    'Apiacá', 'Bom Jesus do Norte', 'Dores do Rio Preto', 'Guaçuí', 'Mimoso do Sul', 'Presidente Kennedy',
    'São José do Calçado',
  ],
};
export const NEIGHBOR_CITIES = Object.entries(NEIGHBORS).flatMap(([state, cities]) =>
  cities.map((city) => ({ city, state })),
);

export type Place = { city?: string; state_code?: string };

const norm = (s = '') => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/-/g, ' ').toLowerCase().trim();

export function isServed(origin: Place, destination: Place): boolean {
  if (origin.state_code === 'RJ') return true;
  if (destination.state_code !== 'RJ') return false;
  return NEIGHBOR_CITIES.some(
    (n) => n.state === origin.state_code && norm(n.city) === norm(origin.city),
  );
}

// Praças de pedágio (automóvel), pesquisadas em 2026-10-08. A rota da Geoapify só diz que um trecho
// tem pedágio, sem valor; aqui a praça é cobrada quando a rota passa a até `radius` metros dela.
// - toward: cobra só no sentido deste ponto (praça unidirecional).
// - weekend: tarifa de sábado, domingo (Via Lagos: de sexta 12h a segunda 12h). Feriados não são tratados.
// - group: praças de uma mesma cobrança; paga uma vez por trajeto.
// - check: dado que precisa ser confirmado com a concessionária.
type Toll = {
  name: string;
  at: [number, number];
  car: number;
  weekend?: number;
  friToMon?: boolean;
  toward?: [number, number];
  radius?: number;
  group?: string;
  check?: string;
};

const NITEROI: [number, number] = [-22.8833, -43.1036];

export const TOLLS: Toll[] = [
  { name: 'Ponte Rio-Niterói', at: [-22.87792, -43.11574], car: 6.6, toward: NITEROI },
  // BR-101 Norte (Arteris Fluminense), R$ 10,80 desde 09/09/2026. P5 cobra só no sentido Niterói.
  { name: 'BR-101 São Gonçalo', at: [-22.77532, -42.94542], car: 10.8, toward: NITEROI },
  { name: 'BR-101 Rio Bonito', at: [-22.6869, -42.54017], car: 10.8 },
  { name: 'BR-101 Casimiro de Abreu', at: [-22.4759, -42.08883], car: 10.8 },
  { name: 'BR-101 Campos (Serrinha)', at: [-22.04928, -41.68477], car: 10.8 },
  { name: 'BR-101 Campos (Conselheiro Josino)', at: [-21.55277, -41.33189], car: 10.8 },
  { name: 'Via Lagos', at: [-22.80084, -42.46453], car: 18.4, weekend: 30.6, friToMon: true, check: 'valores de 01/08/2025; reajuste de 2026 não encontrado' },
  // BR-040 (Elovias), R$ 21 desde 04/11/2025.
  { name: 'BR-040 Xerém', at: [-22.61018, -43.28567], car: 21, check: 'fontes divergem sobre cobrar nos dois sentidos' },
  { name: 'BR-040 Areal', at: [-22.28375, -43.12026], car: 21, check: 'posição: praça "Pedro do Rio" no mapa; sentidos em fonte antiga' },
  { name: 'BR-040 Simão Pereira', at: [-21.92824, -43.31632], car: 21, check: 'vai virar free flow no km 831 (previsto 04/11/2026)' },
  // BR-116 Rio-Teresópolis (EcoRioMinas), R$ 21 desde 22/03/2026. Posição exata não encontrada:
  // cobra quando a rota passa pelo trecho da BR-116 em Guapimirim (único caminho).
  { name: 'BR-116 Guapimirim', at: [-22.535, -42.992], radius: 6000, car: 21, check: 'posição aproximada' },
  { name: 'BR-116 Viúva Graça', at: [-22.71639, -43.71676], radius: 2500, car: 16, check: 'valor de 2024' },
  // Dutra (Motiva RioSP), desde 01/09/2026.
  { name: 'Dutra Itatiaia', at: [-22.49489, -44.56963], car: 14.7 },
  { name: 'Dutra Moreira César', at: [-22.93024, -45.36086], car: 17.1 },
  { name: 'Dutra Jacareí', at: [-23.29648, -46.00741], car: 8.2 },
  { name: 'Dutra Guararema', at: [-23.33889, -46.15016], car: 4.6 },
  { name: 'Dutra Arujá', at: [-23.41312, -46.36104], car: 4.6 },
  // Rio-Santos (free flow), desde 01/09/2026. Pórticos posicionados pelo km ao longo da BR-101.
  { name: 'Rio-Santos Itaguaí', at: [-22.90405, -43.87767], radius: 1500, car: 4.9, weekend: 8.2, check: 'posição aproximada (km 414)' },
  { name: 'Rio-Santos Mangaratiba', at: [-23.00443, -44.09748], radius: 1500, car: 4.9, weekend: 8.2, check: 'posição aproximada (km 447)' },
  { name: 'Rio-Santos Paraty', at: [-23.04385, -44.5751], radius: 1500, car: 4.9, weekend: 8.2, check: 'posição aproximada (km 538)' },
  // RJ-116 (Rota 116).
  { name: 'RJ-116 Itaboraí', at: [-22.71575, -42.81143], car: 9.6, check: 'valor de 01/08/2025' },
  { name: 'RJ-116 Cachoeiras de Macacu', at: [-22.41643, -42.62304], car: 9.6, check: 'valor de 01/08/2025' },
  { name: 'RJ-116 Nova Friburgo', at: [-22.21353, -42.49166], car: 9.6, check: 'valor de 01/08/2025' },
  { name: 'RJ-116 Cordeiro', at: [-22.05461, -42.36237], car: 9.6, check: 'valor de 01/08/2025' },
  // Cidade do Rio.
  { name: 'Linha Amarela', at: [-22.90735, -43.30888], car: 4 },
  { name: 'Transolímpica', at: [-22.91943, -43.39678], car: 9.95, group: 'transolimpica' },
  { name: 'Transolímpica', at: [-22.89589, -43.39923], car: 9.95, group: 'transolimpica' },
];

type Point = [number, number]; // [lat, lon]
const rad = (d: number) => (d * Math.PI) / 180;
const meters = (a: Point, b: Point) =>
  Math.hypot(rad(b[1] - a[1]) * Math.cos(rad((a[0] + b[0]) / 2)), rad(b[0] - a[0])) * 6_371_000;

// Distância (m) do ponto p ao segmento a–b, em projeção plana local.
function toSegment(p: Point, a: Point, b: Point) {
  const k = Math.cos(rad(p[0]));
  const [ax, ay, bx, by] = [(a[1] - p[1]) * k, a[0] - p[0], (b[1] - p[1]) * k, b[0] - p[0]];
  const [dx, dy] = [bx - ax, by - ay];
  const len = dx * dx + dy * dy;
  const t = len ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len)) : 0;
  return Math.hypot(ax + t * dx, ay + t * dy) * 111_320;
}

// Fim de semana no horário do RJ (-03:00).
function isWeekend(when: Date, friToMon = false) {
  const local = new Date(when.getTime() - 3 * 3_600_000);
  const day = local.getUTCDay();
  const hour = local.getUTCHours();
  if (friToMon) return day === 6 || day === 0 || (day === 5 && hour >= 12) || (day === 1 && hour < 12);
  return day === 6 || day === 0;
}

// Pedágios de um trajeto: `line` é a geometria da rota na ordem de viagem.
export function tollsOnRoute(line: Point[], when: Date) {
  const hits: Toll[] = [];
  const groups = new Set<string>();
  for (const toll of TOLLS) {
    if (toll.group && groups.has(toll.group)) continue;
    let best = Infinity;
    let at = 0;
    for (let i = 1; i < line.length; i++) {
      const d = toSegment(toll.at, line[i - 1], line[i]);
      if (d < best) [best, at] = [d, i];
    }
    if (best > (toll.radius ?? 300)) continue;
    if (toll.toward) {
      const before = line[Math.max(0, at - 10)];
      const after = line[Math.min(line.length - 1, at + 10)];
      if (meters(after, toll.toward) >= meters(before, toll.toward)) continue;
    }
    if (toll.group) groups.add(toll.group);
    hits.push(toll);
  }
  const total = hits.reduce((sum, t) => sum + (t.weekend && isWeekend(when, t.friToMon) ? t.weekend : t.car), 0);
  return { total: Math.round(total * 100) / 100, names: hits.map((t) => t.name) };
}

const tripPrice = (meters: number) => Math.max(PRICING.minimumFare, (meters / 1000) * PRICING.perKm);

export type QuoteInput = {
  meters: number; // origem → destino
  roundTrip: boolean;
  sameDay: boolean;
  waitHours: number; // cobrado só em ida e volta no mesmo dia
  tolls?: number; // R$ de pedágio (ida + volta), somado fora da margem
};

export function quote({ meters, roundTrip, sameDay, waitHours, tolls = 0 }: QuoteInput) {
  let value = tripPrice(meters);
  if (roundTrip) value = 2 * value + (sameDay ? Math.max(0, waitHours) * PRICING.waitPerHour : 0);

  const round10 = (n: number) => Math.round(n / 10) * 10;
  return {
    min: round10(value * (1 - PRICING.rangeSpread) + tolls),
    max: round10(value * (1 + PRICING.rangeSpread) + tolls),
  };
}
