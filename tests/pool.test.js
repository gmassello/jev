import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pool } from '../challenge/pool.js';

test('pool keeps the input order and never runs more than the limit at once', async () => {
  let running = 0;
  let peak = 0;
  const out = await pool([30, 5, 20, 1, 10, 2, 15], 3, async (ms, i) => {
    running++;
    peak = Math.max(peak, running);
    await new Promise((r) => setTimeout(r, ms));
    running--;
    return i;
  });
  assert.deepEqual(out, [0, 1, 2, 3, 4, 5, 6]);
  assert.equal(peak, 3);
});
