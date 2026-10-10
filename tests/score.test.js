import { test } from 'node:test';
import assert from 'node:assert/strict';
import { judge, scoreRun, summarize, canRun, bucket } from '../challenge/score.js';

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

test('summarize: 15 answered rows with 12 correct give 12/15 and the 3 failures with their details', () => {
  const rows = Array.from({ length: 15 }, (_, i) => ({ id: `T${i}`, status: 'done', ok: i < 12, answer: 'envios', expected: 'facturacion', confidence: 0.7 }));
  const s = summarize(rows);
  assert.equal(s.correct, 12);
  assert.equal(s.answered, 15);
  assert.equal(s.failed.length, 3);
  assert.deepEqual(Object.keys(s.failed[0]).sort(), ['answer', 'confidence', 'expected', 'id', 'ok', 'status']);
});

test('summarize: a call that failed is not counted, the score is over the tickets that answered', () => {
  const rows = [{ status: 'done', ok: true }, { status: 'error' }, { status: 'done', ok: false }, { status: 'pending' }];
  assert.deepEqual({ ...summarize(rows), failed: summarize(rows).failed.length }, { total: 4, answered: 2, correct: 1, failed: 1, errors: 1 });
});

test('canRun: an empty or blank question cannot be evaluated', () => {
  assert.equal(canRun(''), false);
  assert.equal(canRun('   '), false);
  assert.equal(canRun(undefined), false);
  assert.equal(canRun('¿A qué área va este ticket?'), true);
});

const done = (confidence, ok = true) => ({ status: 'done', confidence, ok });

test('bucket: raising the threshold from 0.5 to 0.9 automates fewer tickets and sends more to review', () => {
  const rows = [done(0.99), done(0.95), done(0.8), done(0.74, false), done(0.6), done(0.55)];
  const low = bucket(rows, 0.5);
  const high = bucket(rows, 0.9);
  assert.deepEqual(low, { auto: 6, review: 0, wrongAuto: 1 });
  assert.deepEqual(high, { auto: 2, review: 4, wrongAuto: 0 });
  assert.ok(high.auto < low.auto && high.review > low.review);
});

test('bucket: at 0.95 with every confidence below, nothing is automated', () => {
  const rows = Array.from({ length: 15 }, () => done(0.9));
  assert.deepEqual(bucket(rows, 0.95), { auto: 0, review: 15, wrongAuto: 0 });
});

test('bucket: a wrong answer above the threshold counts as an error that would be automated', () => {
  assert.deepEqual(bucket([done(0.97, false), done(0.4, false)], 0.9), { auto: 1, review: 1, wrongAuto: 1 });
});

test('bucket: rows without an answer or without confidence are never automated', () => {
  assert.deepEqual(bucket([{ status: 'error' }, { status: 'pending' }, done(null)], 0.5), { auto: 0, review: 1, wrongAuto: 0 });
});
