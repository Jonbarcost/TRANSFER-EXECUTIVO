import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRICING, NEIGHBOR_CITIES, isServed, quote } from './pricing.ts';

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
