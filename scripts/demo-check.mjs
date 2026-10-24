import { I18N } from '../copy.js';

const base = process.env.BASE_URL ?? 'http://localhost:3001';
const lessons = I18N.es.lessons;
const byId = (id) => lessons.find((l) => l.id === id);

const toQuestion = (q) => {
  const out = { type: q.type, instructions: q.text };
  const pairs = q.options.map((o, i) => [o, q.descriptions?.[i] ?? null]);
  if (q.type === 'choice') out.criteria = Object.fromEntries(pairs);
  if (q.type === 'score') out.criteria = pairs.map(([o]) => o);
  return out;
};

const ask = async (L) => {
  const questions = L.questions ? Object.fromEntries(L.questions.map((q) => [q.id, toQuestion(q)])) : { q1: toQuestion(L.question) };
  const res = await fetch(`${base}/evaluate`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ state: L.state, questions }) });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error);
  return body.answers;
};

const results = [];
const check = (name, ok, detail) => { results.push(ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}: ${detail}`); };

const html = await fetch(base).then((r) => r.text()).catch(() => '');
check('server', html.includes('<title>Jev Playground'), base);
if (!results[0]) process.exit(1);

const boolean = (await ask(byId('boolean'))).q1;
check('paso 2 sí con 0,9 o más', boolean.probability >= 0.9, `probability ${boolean.probability.toFixed(2)}`);

const choice = (await ask(byId('choice'))).q1;
check('paso 3 estafa', choice.choice === 'Estafa', `${choice.choice} ${choice.probabilities[choice.choice].toFixed(2)}`);

const score = (await ask(byId('score'))).q1;
check('paso 4 escala', typeof score.score === 'number', `score ${score.score?.toFixed(2)}`);

const criteria = (await ask(byId('criteria'))).q1;
check('paso 5 cuenta', criteria.choice === 'cuenta', `${criteria.choice} ${criteria.probabilities[criteria.choice].toFixed(2)}`);

const multi = await ask(byId('multi'));
check('paso 6 tres respuestas', ['reembolso', 'area', 'urgencia'].every((k) => multi[k]), Object.keys(multi).join(', '));

const L7 = byId('doubt');
const doubt = (await ask(L7)).q1;
const conf = doubt.probabilities[doubt.choice];
check('paso 7 debajo del umbral', conf < L7.threshold, `${doubt.choice} ${conf.toFixed(2)} < ${L7.threshold}`);

process.exit(results.every(Boolean) ? 0 : 1);
