import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { QUESTIONS, LEVELS, TICKETS, validate } from '../challenge/tickets.js';

const results = JSON.parse(readFileSync(new URL('../challenge/results.json', import.meta.url), 'utf8'));

test('the set has 15 tickets in spanish with unique ids', () => {
  assert.equal(TICKETS.length, 15);
  assert.equal(new Set(TICKETS.map((t) => t.id)).size, 15);
  for (const t of TICKETS) assert.match(t.text, /[áéíóúñ¿]|\b(que|el|la|de|mi)\b/i, `${t.id} does not look spanish`);
});

test('every ticket has a valid expected answer for every suggested question', () => {
  assert.deepEqual(validate(), []);
});

test('an expected answer outside the question options is reported with the ticket id', () => {
  const bad = [{ id: 'TX', text: 'Hola', expected: { team: 'ventas', refund: 'si', urgency: 'urgente', products: 'uno' } }];
  const errors = validate(bad);
  assert.equal(errors.length, 3);
  assert.ok(errors.every((e) => e.startsWith('TX:')), errors.join('; '));
});

test('results.json has one run per question, measured on the current tickets', () => {
  assert.deepEqual(results.runs.map((r) => r.question), Object.keys(QUESTIONS));
  for (const run of results.runs) {
    assert.equal(run.total, 15, run.question);
    assert.equal(run.correct, run.rows.filter((r) => r.ok).length, run.question);
    assert.ok(Number.isInteger(run.tokens) && run.tokens > 0, `${run.question}: tokens`);
    assert.ok(Number.isInteger(run.ms) && run.ms > 0, `${run.question}: ms`);
    run.rows.forEach((row, i) => {
      assert.equal(row.id, TICKETS[i].id, `${run.question}: stale results, rerun npm run challenge`);
      assert.deepEqual(row.expected, TICKETS[i].expected[run.question], `${run.question}/${row.id}: stale expected, rerun npm run challenge`);
    });
  }
});

test('the trap question is recorded with its measured result and a confidence per ticket', () => {
  const traps = results.runs.filter((r) => r.trap);
  assert.deepEqual(traps.map((r) => r.question), Object.keys(QUESTIONS).filter((id) => QUESTIONS[id].trap));
  for (const run of traps) {
    assert.equal(run.rows.length, 15);
    assert.ok(run.rows.every((r) => typeof r.confidence === 'number'));
  }
});

test('score questions declare their ordered levels', () => {
  for (const [id, q] of Object.entries(QUESTIONS).filter(([, q]) => q.type === 'score')) {
    assert.equal(LEVELS[id]?.length, q.criteria.length, id);
  }
});
