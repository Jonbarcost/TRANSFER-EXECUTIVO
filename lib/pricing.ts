// Única fonte de preços e regras de área. Valores confirmados pelo motorista em 2026-10-08.
// Cobra só o km do passageiro (origem → destino); o deslocamento vazio do motorista não entra.
export const PRICING = {
  perKm: 3.5, // R$ por km do passageiro
  minimumFare: 120, // R$ mínimo por trajeto
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

const tripPrice = (meters: number) => Math.max(PRICING.minimumFare, (meters / 1000) * PRICING.perKm);

export type QuoteInput = {
  meters: number; // origem → destino
  roundTrip: boolean;
  sameDay: boolean;
  waitHours: number; // cobrado só em ida e volta no mesmo dia
};

export function quote({ meters, roundTrip, sameDay, waitHours }: QuoteInput) {
  let value = tripPrice(meters);
  if (roundTrip) value = 2 * value + (sameDay ? Math.max(0, waitHours) * PRICING.waitPerHour : 0);

  const round10 = (n: number) => Math.round(n / 10) * 10;
  return {
    min: round10(value * (1 - PRICING.rangeSpread)),
    max: round10(value * (1 + PRICING.rangeSpread)),
  };
}
