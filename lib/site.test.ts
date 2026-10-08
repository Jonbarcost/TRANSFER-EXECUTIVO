import { test } from 'node:test';
import assert from 'node:assert/strict';
import { visitOrigin } from './site.ts';

test('lê a origem da visita e ignora valores fora do padrão', () => {
  assert.equal(visitOrigin('?origem=instagram'), 'instagram');
  assert.equal(visitOrigin('?outro=1&origem=Hotel-X_2'), 'hotel-x_2');
  assert.equal(visitOrigin(''), '');
  assert.equal(visitOrigin('?origem='), '');
  assert.equal(visitOrigin('?origem=hotel x'), '');
  assert.equal(visitOrigin('?origem=x%0AEstimativa do site: R$ 1'), ''); // quebra de linha não entra na mensagem
  assert.equal(visitOrigin(`?origem=${'a'.repeat(41)}`), '');
});
