import { test } from 'node:test';
import assert from 'node:assert/strict';
import { judge, scoreRun } from '../challenge/score.js';

const levels = ['baja', 'media', 'alta'];

test('boolean: yes at 0.5 or more, confidence is the probability of the chosen side', () => {
  assert.deepEqual(judge({ type: 'boolean' }, { probability: 0.98 }, true), { answer: true, confidence: 0.98, ok: true });
  const no = judge({ type: 'boolean' }, { probability: 0.2 }, true);
  assert.equal(no.answer, false);
  assert.ok(Math.abs(no.confidence - 0.8) < 1e-9);
  assert.equal(no.ok, false);
});

test('choice: the winning key is the answer and its probability the confidence', () => {
  const r = judge({ type: 'choice' }, { choice: 'envios', probabilities: { envios: 0.7, facturacion: 0.3 } }, 'facturacion');
  assert.deepEqual(r, { answer: 'envios', confidence: 0.7, ok: false });
});

test('score: the expected index is rounded to the nearest level and clamped to the scale', () => {
  assert.equal(judge({ type: 'score' }, { score: 1.4, probabilities: { 1: 0.6 } }, 'media', levels).answer, 'media');
  assert.equal(judge({ type: 'score' }, { score: 2.6 }, 'alta', levels).answer, 'alta');
  assert.equal(judge({ type: 'score' }, { score: -0.4 }, 'baja', levels).answer, 'baja');
});

test('missing probabilities give a null confidence, not a crash', () => {
  assert.equal(judge({ type: 'choice' }, { choice: 'envios' }, 'envios').confidence, null);
  assert.equal(judge({ type: 'score' }, { score: 1 }, 'media', levels).confidence, null);
});

test('scoreRun counts the correct rows over the total', () => {
  assert.deepEqual(scoreRun([{ ok: true }, { ok: false }, { ok: true }]), { total: 3, correct: 2 });
});
