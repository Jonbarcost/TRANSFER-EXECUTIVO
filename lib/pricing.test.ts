import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRICING, NEIGHBOR_CITIES, isServed, quote, tollsOnRoute } from './pricing.ts';

const within = (r: { min: number; max: number }, v: number) => r.min <= v && v <= r.max;

test('área atendida: origem no RJ sempre aceita', () => {
  assert.equal(isServed({ state_code: 'RJ' }, { state_code: 'SP' }), true);
});

test('área atendida: outro estado só se for cidade de divisa com destino no RJ', () => {
  assert.equal(isServed({ city: 'Passa Vinte', state_code: 'MG' }, { state_code: 'RJ' }), true);
  assert.equal(isServed({ city: 'UBATUBA', state_code: 'SP' }, { state_code: 'RJ' }), true);
  assert.equal(isServed({ city: 'Ubatuba', state_code: 'SP' }, { state_code: 'SP' }), false);
  assert.equal(isServed({ city: 'Juiz de Fora', state_code: 'MG' }, { state_code: 'RJ' }), false);
  assert.equal(isServed({ city: 'Ubatuba', state_code: 'MG' }, { state_code: 'RJ' }), false);
  assert.equal(NEIGHBOR_CITIES.length, 38);
});

test('só ida cobra apenas o km do passageiro', () => {
  const r = quote({ meters: 80_000, roundTrip: false, sameDay: false, waitHours: 0 });
  assert.ok(within(r, 80 * PRICING.perKm));
  assert.ok(r.min < r.max);
});

test('preço mínimo vale para trajetos curtos', () => {
  const r = quote({ meters: 3_000, roundTrip: false, sameDay: false, waitHours: 0 });
  assert.ok(within(r, PRICING.minimumFare));
});

test('ida e volta no mesmo dia soma a espera', () => {
  const r = quote({ meters: 80_000, roundTrip: true, sameDay: true, waitHours: 3 });
  assert.ok(within(r, 2 * 80 * PRICING.perKm + 3 * PRICING.waitPerHour));
});

test('ida e volta em dias diferentes não cobra espera', () => {
  const r = quote({ meters: 80_000, roundTrip: true, sameDay: false, waitHours: 30 });
  assert.ok(within(r, 2 * 80 * PRICING.perKm));
});

// Linha reta de a até b com n pontos, em [lat, lon].
const path = (a: [number, number], b: [number, number], n = 40): [number, number][] =>
  Array.from({ length: n }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / (n - 1), a[1] + ((b[1] - a[1]) * i) / (n - 1)]);
const weekday = new Date('2026-10-20T10:00:00-03:00'); // terça
const saturday = new Date('2026-10-24T10:00:00-03:00');

test('pedágio unidirecional: Ponte cobra só no sentido Niterói', () => {
  const rioToNiteroi = path([-22.885, -43.17], [-22.875, -43.105]);
  assert.deepEqual(tollsOnRoute(rioToNiteroi, weekday), { total: 6.6, names: ['Ponte Rio-Niterói'] });
  assert.equal(tollsOnRoute([...rioToNiteroi].reverse(), weekday).total, 0);
});

test('pedágio com tarifa de fim de semana (Via Lagos)', () => {
  const viaLagos = path([-22.79, -42.49], [-22.81, -42.44]);
  assert.equal(tollsOnRoute(viaLagos, weekday).total, 18.4);
  assert.equal(tollsOnRoute(viaLagos, saturday).total, 30.6);
  assert.equal(tollsOnRoute(viaLagos, new Date('2026-10-23T15:00:00-03:00')).total, 30.6); // sexta à tarde
});

test('praças do mesmo grupo cobram uma vez e rota longe não cobra nada', () => {
  const transolimpica = path([-22.93, -43.397], [-22.89, -43.399]);
  assert.deepEqual(tollsOnRoute(transolimpica, weekday), { total: 9.95, names: ['Transolímpica'] });
  assert.equal(tollsOnRoute(path([-22.97, -43.19], [-22.98, -43.22]), weekday).total, 0); // Copacabana → Ipanema
});

test('pedágio entra na faixa sem a margem de ±10%', () => {
  const sem = quote({ meters: 100_000, roundTrip: false, sameDay: false, waitHours: 0 });
  const com = quote({ meters: 100_000, roundTrip: false, sameDay: false, waitHours: 0, tolls: 20 });
  assert.equal(com.min - sem.min, 20);
  assert.equal(com.max - sem.max, 20);
});
