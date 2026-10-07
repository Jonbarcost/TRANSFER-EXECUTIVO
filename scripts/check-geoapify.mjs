// PASSO 0 — validação descartável das APIs Geoapify (Autocomplete + Routing).
// Uso: GEOAPIFY_API_KEY=... node scripts/check-geoapify.mjs
const KEY = process.env.GEOAPIFY_API_KEY;
if (!KEY) throw new Error('Defina GEOAPIFY_API_KEY');

// Base do motorista: Copacabana (coordenada aproximada, só para o teste).
const BASE = { lat: -22.9711, lon: -43.1863 };

async function get(path, params) {
  const url = `https://api.geoapify.com/v1/${path}?${new URLSearchParams({ ...params, apiKey: KEY })}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(json)}`);
  return json;
}

async function autocomplete(text) {
  const json = await get('geocode/autocomplete', {
    text,
    lang: 'pt',
    filter: 'countrycode:br',
    bias: `proximity:${BASE.lon},${BASE.lat}`,
    format: 'json',
    limit: '3',
  });
  return json.results ?? [];
}

async function route(a, b, extra = {}) {
  const json = await get('routing', {
    waypoints: `${a.lat},${a.lon}|${b.lat},${b.lon}`,
    mode: 'drive',
    details: 'route_details',
    lang: 'pt',
    ...extra,
  });
  return json.features?.[0]?.properties;
}

const km = (m) => `${(m / 1000).toFixed(1)} km`;
const min = (s) => `${Math.round(s / 60)} min`;
const hasToll = (p) => JSON.stringify(p).includes('"toll":true');

const TRIPS = [
  ['Aeroporto Internacional do Galeão', 'Copacabana Palace'],
  ['Aeroporto Santos Dumont', 'Barra da Tijuca'],
  ['Copacabana, Rio de Janeiro', 'Niterói'],
  ['Copacabana, Rio de Janeiro', 'Armação dos Búzios'],
  ['Barra da Tijuca', 'Arraial do Cabo'],
  ['Ipanema, Rio de Janeiro', 'Petrópolis'],
  ['Aeroporto Santos Dumont', 'Paraty'],
];

for (const [from, to] of TRIPS) {
  const origins = await autocomplete(from);
  const dests = await autocomplete(to);
  const [o] = origins, [t] = dests;
  console.log(`"${from}" → ${origins.map((r) => `${r.formatted} [${r.result_type}]`).join(' | ') || 'SEM SUGESTÃO'}`);
  console.log(`"${to}" → ${dests.map((r) => `${r.formatted} [${r.result_type}]`).join(' | ') || 'SEM SUGESTÃO'}`);
  if (!o || !t) { console.log(); continue; }

  const go = await route(o, t);
  const traffic = await route(o, t, { traffic: 'approximated' }).catch((e) => ({ error: e.message.slice(0, 120) }));
  // Uma única chamada com vários pontos: base → origem → destino → base.
  const ops = await get('routing', {
    waypoints: [BASE, o, t, BASE].map((p) => `${p.lat},${p.lon}`).join('|'),
    mode: 'drive',
  }).then((j) => j.features?.[0]?.properties);

  console.log(`  ida:      ${km(go.distance)} | ${min(go.time)} | trecho com pedágio: ${hasToll(go) ? 'sim' : 'não informado'}`);
  console.log(`  trânsito: ${traffic.error ?? `${km(traffic.distance)} | ${min(traffic.time)}`}`);
  console.log(`  operação: ${km(ops.distance)} total | trechos ${(ops.legs ?? []).map((l) => km(l.distance)).join(' + ')}`);
  console.log(`  origem:   ${o.lat.toFixed(4)}, ${o.lon.toFixed(4)} | ${o.city ?? '-'} / ${o.state_code ?? o.state ?? '-'}\n`);
}
