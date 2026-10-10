import { writeFile } from 'node:fs/promises';
import { experimental_evaluate as evaluate } from 'ai';
import { QUESTIONS, LEVELS, TICKETS } from '../challenge/tickets.js';
import { judge, scoreRun } from '../challenge/score.js';

const MODEL = process.env.JEV_MODEL ?? 'typesafe-ai/jev';
const CONCURRENCY = 5;
const OUT = new URL('../challenge/results.json', import.meta.url);

const pool = async (items, size, fn) => {
  const out = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: size }, worker));
  return out;
};

const runQuestion = async (id) => {
  const { trap, ...question } = QUESTIONS[id];
  const started = Date.now();
  const results = await pool(TICKETS, CONCURRENCY, (ticket) =>
    evaluate({ model: MODEL, state: ticket.text, questions: { [id]: question } }));
  const ms = Date.now() - started;
  const rows = TICKETS.map((ticket, i) => ({
    id: ticket.id,
    expected: ticket.expected[id],
    ...judge(question, results[i].answers[id], ticket.expected[id], LEVELS[id]),
  }));
  const tokens = results.reduce((sum, r) => sum + (r.usage.inputTokens ?? 0), 0);
  const outputTokens = results.reduce((sum, r) => sum + (r.usage.outputTokens ?? 0), 0);
  return { question: id, trap: Boolean(trap), ...scoreRun(rows), tokens, outputTokens, ms, rows };
};

const runs = [];
for (const id of Object.keys(QUESTIONS)) {
  const run = await runQuestion(id);
  runs.push(run);
  console.log(`${id.padEnd(9)} ${run.correct}/${run.total}  ${run.ms} ms  ${run.tokens} input tokens${run.trap ? '  (trap)' : ''}`);
}

await writeFile(OUT, `${JSON.stringify({ model: MODEL, ranAt: new Date().toISOString(), runs }, null, 2)}\n`);
console.log(`wrote ${OUT.pathname}`);
