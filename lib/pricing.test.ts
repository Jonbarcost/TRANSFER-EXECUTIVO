import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRICING, NEIGHBOR_CITIES, isServed, quote, scenarios } from './pricing.ts';

const legs = { a: 10_000, b: 30_000, c: 20_000 };

test('área atendida: origem no RJ sempre aceita', () => {
  assert.equal(isServed({ state_code: 'RJ' }, { state_code: 'SP' }), true);
});

test('área atendida: outro estado só se for cidade vizinha com destino no RJ', () => {
  NEIGHBOR_CITIES.push({ city: 'Juiz de Fora', state: 'MG' });
  try {
    assert.equal(isServed({ city: 'Juiz de Fora', state_code: 'MG' }, { state_code: 'RJ' }), true);
    assert.equal(isServed({ city: 'JUIZ DE FORA', state_code: 'MG' }, { state_code: 'SP' }), false);
    assert.equal(isServed({ city: 'Belo Horizonte', state_code: 'MG' }, { state_code: 'RJ' }), false);
  } finally {
    NEIGHBOR_CITIES.pop();
  }
});

test('só ida usa a distância operacional base → O → D → base', () => {
  const km = (legs.a + legs.b + legs.c) / 1000;
  const v = Math.max(PRICING.minimumFare, PRICING.baseFee + km * PRICING.perKm);
  const r = quote({ legs, roundTrip: false, sameDay: false, waitHours: 0 });
  assert.ok(r.min <= v && v <= r.max);
  assert.ok(r.min < r.max);
});

test('preço mínimo vale para trajetos curtos', () => {
  const r = quote({ legs: { a: 100, b: 100, c: 100 }, roundTrip: false, sameDay: false, waitHours: 0 });
  assert.ok(r.min <= PRICING.minimumFare && PRICING.minimumFare <= r.max);
});

test('cenários de ida e volta no mesmo dia saem dos mesmos trechos', () => {
  const s = scenarios(legs, 2);
  const oneWay = Math.max(PRICING.minimumFare, PRICING.baseFee + 60 * PRICING.perKm);
  assert.equal(s.return, 2 * oneWay);
  const waitKm = (2 * legs.a + 2 * legs.b) / 1000;
  assert.equal(s.wait, Math.max(PRICING.minimumFare, PRICING.baseFee + waitKm * PRICING.perKm) + 2 * PRICING.waitPerHour);
});

test('ida e volta em dias diferentes = duas operações', () => {
  const r = quote({ legs, roundTrip: true, sameDay: false, waitHours: 5 });
  const v = scenarios(legs, 0).return;
  assert.ok(r.min <= v && v <= r.max);
});
