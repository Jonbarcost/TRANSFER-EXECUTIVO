import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LANGS, browserLang, fill, langPath } from './i18n.ts';

const shape = (o: object): unknown =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Array.isArray(v) ? v.map((x) => x.length) : typeof v === 'object' ? shape(v) : typeof v]));

test('todos os idiomas têm as mesmas chaves e placeholders', () => {
  const ref = shape(LANGS.pt);
  const holes = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join();
  for (const [code, d] of Object.entries(LANGS)) {
    assert.deepEqual(shape(d), ref, code);
    assert.equal(holes(d.duration), holes(LANGS.pt.duration), code);
    assert.equal(holes(d.errors.passengers), holes(LANGS.pt.errors.passengers), code);
    assert.equal(holes(d.tollIncluded), holes(LANGS.pt.tollIncluded), code);
  }
});

test('idioma do navegador, caminho de cada idioma e preenchimento', () => {
  assert.equal(browserLang(['fr-CA', 'en']), 'fr');
  assert.equal(browserLang(['sv-SE', 'constructor']), undefined);
  assert.equal(langPath('pt'), '/');
  assert.equal(langPath('ar'), '/ar');
  assert.equal(fill('{min} a {max}', { min: 1, max: 2 }), '1 a 2');
});
