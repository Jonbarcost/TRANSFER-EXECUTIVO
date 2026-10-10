import { test, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { CONSENT_KEY, measurementId, measurementUrl, readMeasurementChoice, saveMeasurementChoice, startMeasurement, stopMeasurement, trackEvent } from './analytics.ts';

function browser(t: TestContext, otherTag = false) {
  const scripts: { src: string }[] = [];
  const memory = new Map<string, string>();
  const fakeWindow = { location: new URL('https://transfer-executivo-amber.vercel.app/en?origem=hotel-x&utm_source=google&gclid=test&email=private&analytics_debug=1#quote') };
  const fakeDocument = {
    referrer: 'https://example.com/page?email=private',
    documentElement: { lang: 'en' },
    cookie: '_ga=old; _gcl_aw=old; unrelated=keep',
    querySelector: () => otherTag ? {} : null,
    createElement: () => ({}),
    head: { appendChild: (script: { src: string }) => scripts.push(script) },
  };
  const values = { window: fakeWindow, document: fakeDocument, localStorage: { getItem: (key: string) => memory.get(key) ?? null, setItem: (key: string, value: string) => memory.set(key, value) } };
  for (const [key, value] of Object.entries(values)) {
    const old = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() => { if (old) Object.defineProperty(globalThis, key, old); else Reflect.deleteProperty(globalThis, key); });
  }
  return { scripts, memory, commands: () => (window.dataLayer ?? []).map(args => Array.from(args as ArrayLike<unknown>)) };
}

test('só aceita ID do fluxo GA4 e desativa previews', () => {
  for (const value of ['', '123456789', '123-456-7890', 'AW-1234567890', 'GTM-ABC', 'G-123<script>']) assert.equal(measurementId(value), '');
  assert.equal(measurementId(' G-TEST123456 ', 'production'), 'G-TEST123456');
  assert.equal(measurementId('G-TEST123456', 'preview'), '');
});

test('mantém atribuição da campanha sem query arbitrária nem hash', () => {
  assert.equal(measurementUrl('https://site.test/en?gclid=abc&gbraid=xyz&wbraid=w&utm_source=google&utm_campaign=rio&email=private&text=notes#quote'),
    'https://site.test/en?gclid=abc&gbraid=xyz&wbraid=w&utm_source=google&utm_campaign=rio');
});

test('sem ativação/ID não há tag nem eventos; rejeição é persistida', t => {
  const b = browser(t);
  assert.equal(trackEvent('whatsapp_click'), false);
  assert.equal(startMeasurement('123456789'), false);
  saveMeasurementChoice('rejected');
  assert.equal(readMeasurementChoice(), 'rejected');
  assert.equal(b.scripts.length, 0);
  assert.deepEqual(b.commands(), []);
});

test('montagens/aceites repetidos carregam e configuram exatamente uma tag', t => {
  const b = browser(t);
  assert.equal(startMeasurement('G-TEST123456'), true);
  assert.equal(startMeasurement('G-TEST123456'), true);
  assert.equal(startMeasurement('G-OTHER12345'), false);
  assert.equal(b.scripts.length, 1);
  assert.equal(b.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-TEST123456');
  const commands = b.commands();
  assert.equal(commands.filter(c => c[0] === 'config').length, 1);
  assert.deepEqual(commands.slice(0, 2).map(c => c.slice(0, 2)), [['consent', 'default'], ['consent', 'update']]);
  const config = commands.find(c => c[0] === 'config')![2] as Record<string, unknown>;
  assert.equal(config.page_location, 'https://transfer-executivo-amber.vercel.app/en?utm_source=google&gclid=test');
  assert.equal(config.page_referrer, 'https://example.com');
  assert.equal(config.debug_mode, true);
  assert.equal(config.allow_ad_personalization_signals, false);
  // O config produz page_view; não há um segundo envio manual.
  assert.equal(commands.filter(c => c[0] === 'event' && c[1] === 'page_view').length, 0);
});

test('tag/GTM preexistente impede uma segunda instalação', t => {
  const b = browser(t, true);
  assert.equal(startMeasurement('G-TEST123456'), false);
  assert.equal(trackEvent('quote_start'), false);
  assert.equal(b.scripts.length, 0);
});

test('eventos têm um destino e lista fechada; retirada bloqueia eventos futuros', t => {
  const b = browser(t);
  startMeasurement('G-TEST123456');
  trackEvent('whatsapp_click', { contact_location: 'quote', trip_type: 'one_way', notes: 'private', link_url: 'https://wa.me/?text=private', value: 200 } as Parameters<typeof trackEvent>[1]);
  const payload = b.commands().find(c => c[0] === 'event')![2];
  assert.deepEqual(payload, { send_to: 'G-TEST123456', language: 'en', visit_origin: 'hotel-x', contact_location: 'quote', trip_type: 'one_way', debug_mode: true });
  stopMeasurement();
  assert.equal(trackEvent('quote_success'), false);
  assert.equal(Reflect.get(window, 'ga-disable-G-TEST123456'), true);
  startMeasurement('G-TEST123456');
  assert.equal(Reflect.get(window, 'ga-disable-G-TEST123456'), false);
  assert.equal(trackEvent('quote_success'), true);
  assert.equal(b.commands().filter(c => c[0] === 'config').length, 1);
  assert.equal(b.scripts.length, 1);
});

test('escolha vencida ou inválida exige novo aceite', t => {
  const b = browser(t);
  for (const saved of ['invalid', 'null', JSON.stringify({ choice: 'accepted', time: 0 }), JSON.stringify({ choice: 'other', time: Date.now() })]) {
    b.memory.set(CONSENT_KEY, saved);
    assert.equal(readMeasurementChoice(), null);
  }
  saveMeasurementChoice('accepted');
  assert.equal(readMeasurementChoice(), 'accepted');
});
