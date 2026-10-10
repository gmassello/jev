import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimateUsd, formatUsd, costParts } from '../pricing.js';

test('one million input tokens cost the published US$0.042', () => {
  assert.ok(Math.abs(estimateUsd(1_000_000) - 0.042) < 1e-12);
});

test('a 15-ticket run of 6635 input tokens costs about US$0.00028', () => {
  assert.ok(Math.abs(estimateUsd(6635) - 0.00028) < 0.000005);
});

test('missing or invalid usage gives no cost instead of NaN', () => {
  for (const tokens of [undefined, null, NaN, -1, '400']) assert.equal(estimateUsd(tokens), null);
  assert.equal(formatUsd(estimateUsd(undefined)), '—');
});

test('the cost is formatted with the locale of the selected language', () => {
  assert.equal(formatUsd(0.00028, 'en-US'), 'US$0.00028');
  assert.equal(formatUsd(0.00028, 'es-AR'), 'US$0,00028');
});

test('a finished 15-ticket run shows seconds, input tokens and estimated cost in the selected locale', () => {
  assert.deepEqual(costParts({ ms: 1100, inputTokens: 6635 }, 'es-AR'), { seconds: '1,1', tokens: '6.635', usd: 'US$0,00028' });
  assert.deepEqual(costParts({ ms: 1100, inputTokens: 6635 }, 'en-US'), { seconds: '1.1', tokens: '6,635', usd: 'US$0.00028' });
});

test('a run without usage or time shows dashes, not NaN', () => {
  assert.deepEqual(costParts({}, 'es-AR'), { seconds: '—', tokens: '—', usd: '—' });
});
