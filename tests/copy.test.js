import { test } from 'node:test';
import assert from 'node:assert/strict';
import { I18N, resolve, keyOrCredit, costSplit, typeTag } from '../copy.js';
import { readFileSync } from 'node:fs';

const shape = (value) =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.keys(value).sort().map((k) => [k, shape(value[k])]))
    : typeof value;

test('es and en copy tables have the same keys at every level', () => {
  assert.deepEqual(shape(I18N.es), shape(I18N.en));
});

test('every _tech key has its _plain twin in both languages', () => {
  for (const lang of ['es', 'en']) {
    for (const key of Object.keys(I18N[lang]).filter((k) => k.endsWith('_tech'))) {
      assert.ok(`${key.slice(0, -5)}_plain` in I18N[lang], `${lang}: ${key} without _plain`);
    }
  }
});

test('an unknown language falls back to english', () => {
  assert.equal(resolve('fr').run, I18N.en.run);
});

test('a key missing in a language falls back to english without breaking', () => {
  const table = { en: { hello: 'Hello', bye: 'Bye' }, es: { hello: 'Hola' } };
  assert.deepEqual(resolve('es', table), { hello: 'Hola', bye: 'Bye' });
});

test('the UI says probabilidad, never "de seguridad", for a probability', () => {
  const values = Object.values(I18N.es).map((v) => (typeof v === 'function' ? v(98) : String(v)));
  assert.ok(!values.some((v) => v.includes('de seguridad')), 'found "de seguridad" in the es table');
  assert.equal(I18N.es.sure(0.98), 'Probabilidad de «sí»: 0,98');
  assert.equal(I18N.en.sure(0.98), 'Probability of “yes”: 0.98');
});

test('the playground explains a yes/no answer and a scale answer in plain words', () => {
  for (const lang of ['es', 'en']) {
    const lines = ['yes', 'no', 'review'].map((zone) => I18N[lang].explain.boolean(0.97, zone));
    for (const line of lines) assert.ok(line.includes('probability: 0.97') && !line.includes('%'), `${lang}: ${line}`);
    assert.equal(new Set(lines).size, 3, `${lang}: one reading per zone`);
  }
  assert.match(I18N.es.explain.score('Enojado', 3, 4), /«Enojado» \(nivel 3 de 4\)/);
  assert.match(I18N.en.explain.choice('Shipping', 0.81, 'Billing', 0.12), /“Shipping”/);
});

test('the lesson has the same steps in es and en, from theory to one call with several questions and a doubtful case', () => {
  const shape = (lang) => I18N[lang].lessons.map((l) => [l.id, l.kind, l.question?.type ?? null, l.question?.options.length ?? 0, l.question?.descriptions?.length ?? 0, (l.questions ?? []).map((q) => [q.type, q.options.length])]);
  assert.deepEqual(shape('es'), shape('en'));
  const lessons = I18N.es.lessons;
  assert.equal(lessons[0].kind, 'theory');
  assert.deepEqual([...new Set(lessons.filter((l) => l.kind === 'ask').map((l) => l.question.type))].sort(), ['boolean', 'choice', 'score']);
  const multi = lessons.find((l) => l.kind === 'multi');
  assert.equal(multi.kind, 'multi');
  assert.deepEqual(multi.questions.map((q) => q.type).sort(), ['boolean', 'choice', 'score']);
  assert.equal(new Set(multi.questions.map((q) => q.id)).size, multi.questions.length);
});

test('a choice answer is explained with what Jev returned: the pick and the runner-up, no threshold', () => {
  for (const lang of ['es', 'en']) {
    const line = I18N[lang].explain.choice('facturacion', 0.68, 'envios', 0.24);
    const sep = lang === 'es' ? ',' : '.';
    for (const part of ['choice', 'facturacion', `0${sep}68`, 'envios', `0${sep}24`]) assert.ok(line.includes(part), `${lang}: ${part} in ${line}`);
    assert.ok(!line.includes('%'), `${lang}: ${line}`);
    assert.ok(!/umbral|threshold/i.test(line), `${lang}: ${line}`);
  }
  assert.ok(!('thresholdNote' in I18N.es) && !('thresholdNote' in I18N.en));
  for (const lang of ['es', 'en']) assert.equal(I18N[lang].lessons.find((l) => l.id === 'doubt').threshold, undefined, lang);
});

test('the similar-projects step has the same rows and links in es and en, led by Clef and Strands Decider', () => {
  const table = (lang) => I18N[lang].lessons.find((l) => l.id === 'similar').table;
  const [es, en] = [table('es'), table('en')];
  assert.deepEqual(es.rows.map((r) => r[1]), en.rows.map((r) => r[1]));
  for (const t of [es, en]) for (const r of t.rows) assert.equal(r.length, t.head.length + 1);
  assert.deepEqual(es.rows.slice(0, 2).map((r) => r[0]), ['Cloudflare Clef', 'AWS Strands Decider 2B']);
});

test('the README snippet installs the pinned ai and makes a runnable decide call with the 0.7 threshold', () => {
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  const pinned = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).dependencies.ai;
  for (const part of ['## Use it in your code', `npm i ai@${pinned}`, 'experimental_decide', "model: 'typesafe-ai/jev'", '>= 0.7']) assert.ok(readme.includes(part), part);
  assert.ok(!readme.includes('experimental_evaluate'));
});

test('the doubt step is a practice step with four runnable examples, ambiguous text first, each with what to do', () => {
  for (const lang of ['es', 'en']) {
    const step = I18N[lang].lessons.find((l) => l.id === 'doubt');
    assert.equal(step.kind, 'ask', lang);
    assert.ok(!I18N[lang].lessons.some((l) => l.id === 'when'), lang);
    assert.equal(step.examples.length, 4, lang);
    assert.equal(step.examples[0].question.type, 'choice', lang);
    for (const e of step.examples) for (const k of ['label', 'state', 'question', 'fix']) assert.ok(e[k], `${lang}: ${k}`);
    assert.equal(step.state, step.examples[0].state, lang);
    assert.deepEqual(step.question, step.examples[0].question, lang);
  }
  assert.ok(!JSON.stringify(I18N.es.lessons.find((l) => l.id === 'doubt')).includes('primera opción'));
});

test('the architecture, production and code steps are gone', () => {
  for (const lang of ['es', 'en']) {
    const ids = I18N[lang].lessons.map((l) => l.id);
    assert.ok(!ids.includes('arch') && !ids.includes('prod') && !ids.includes('code'), lang);
  }
});

test('confidence has its own line, separate from the choice explanation', () => {
  for (const lang of ['es', 'en']) {
    const t = I18N[lang];
    assert.ok(t.confidenceNote(0.52).includes(t.prob(0.52)) && !t.confidenceNote(0.52).includes('%'), `${lang}: confidenceNote`);
    assert.notEqual(t.confidenceNote(0.52), t.explain.choice('facturacion', 0.52, 'envios', 0.3));
  }
});

test('the footer shows input and output tokens with their cost, the total, model and time, with a dash when the cost is missing', () => {
  for (const lang of ['es', 'en']) {
    const t = I18N[lang];
    const full = t.footer({ input: 275, output: 21, inputCost: 1.155e-5, outputCost: 0, cost: 1.155e-5, modelId: 'typesafe-ai/jev-1.14.0', ms: 900 });
    for (const part of ['275', '21', 'US$', 'Total', 'typesafe-ai/jev-1.14.0', '900']) assert.ok(full.includes(part), `${lang}: ${part} in ${full}`);
    const lines = full.split('\n');
    assert.equal(lines.length, 5, lang);
    assert.match(lines[0], { es: /^Tokens de entrada: 275/, en: /^Input tokens: 275/ }[lang]);
    assert.match(lines[1], { es: /^Tokens de salida: 21/, en: /^Output tokens: 21/ }[lang]);
    assert.ok(!full.includes('llamadas') && !full.includes('calls'), `${lang}: ${full}`);
    assert.equal(t.costScale(1.155e-5), { es: '10.000 llamadas como esta: US$0,115', en: '10,000 calls like this one: US$0.115' }[lang]);
    const noCost = t.footer({ input: 275, output: 21, inputCost: null, outputCost: null, cost: null, modelId: 'typesafe-ai/jev', ms: 900 });
    assert.ok(noCost.includes('—') && !noCost.includes('undefined') && !noCost.includes('null') && !noCost.includes('llamadas') && !noCost.includes('calls'), `${lang}: ${noCost}`);
  }
});

test('costSplit puts the gateway cost on input tokens and the rest on output, from a real call', () => {
  const { inputCost, outputCost } = costSplit({ inputTokens: 275, outputTokens: 21 }, 1.155e-5);
  assert.ok(Math.abs(inputCost - 1.155e-5) < 1e-12 && outputCost < 1e-12, `${inputCost} ${outputCost}`);
  assert.deepEqual(costSplit({ inputTokens: 275, outputTokens: 21 }, null), { inputCost: null, outputCost: null });
});

test('the guardrail step comes right after doubt: a yes/no over a policy and a chatbot reply', () => {
  for (const lang of ['es', 'en']) {
    const ids = I18N[lang].lessons.map((l) => l.id);
    assert.equal(ids.indexOf('guard'), ids.indexOf('doubt') + 1, lang);
    const step = I18N[lang].lessons.find((l) => l.id === 'guard');
    assert.equal(step.kind, 'ask', lang);
    assert.equal(step.question.type, 'boolean', lang);
    assert.match(step.state, lang === 'es' ? /30 días[\s\S]*90 días/ : /30 days[\s\S]*90 days/);
  }
});

test('a gateway key or credit error becomes a plain message with what to do', () => {
  const raw = 'AI Gateway authentication failed: Invalid API key or token.\n\nCreate a new API key: https://vercel.com/d';
  assert.equal(keyOrCredit(raw), true);
  assert.equal(keyOrCredit('Insufficient credits: add funds to continue'), true);
  assert.equal(keyOrCredit('Unexpected token } in JSON at position 3'), false);
  for (const lang of ['es', 'en']) {
    assert.ok(I18N[lang].errKey && I18N[lang].errKeyFix, lang);
    assert.ok(!I18N[lang].errKey.includes('authentication failed'), lang);
  }
  assert.match(I18N.es.errKey, /^Jev no respondió: la key no es válida o no hay saldo/);
});

test('the ask block tells that the text, question and options can be edited', () => {
  for (const lang of ['es', 'en']) {
    assert.ok(I18N[lang].editHint?.trim(), `${lang}: editHint`);
    assert.ok(I18N[lang].editHintMulti?.trim(), `${lang}: editHintMulti`);
  }
});

test('the timer has start, pause, reset and a label in both languages', () => {
  for (const lang of ['es', 'en']) {
    for (const key of ['timerStart', 'timerPause', 'timerReset', 'timerLabel']) assert.ok(I18N[lang][key]?.trim(), `${lang}: ${key}`);
  }
  assert.equal(I18N.es.timerPause, 'Pausar');
});

test('defects comes right after guard: a choice with four defined options, and the regression case is gone', () => {
  for (const lang of ['es', 'en']) {
    const ids = I18N[lang].lessons.map((l) => l.id);
    assert.deepEqual(ids.slice(ids.indexOf('guard'), ids.indexOf('guard') + 2), ['guard', 'defects'], lang);
    assert.ok(!ids.includes('regression'), lang);
    for (const id of ['defects']) {
      const step = I18N[lang].lessons.find((l) => l.id === id);
      assert.equal(step.kind, 'ask', `${lang} ${id}`);
      assert.equal(step.question.type, 'choice', `${lang} ${id}`);
      assert.equal(step.question.options.length, 4, `${lang} ${id}`);
      assert.equal(step.question.descriptions.length, 4, `${lang} ${id}`);
    }
  }
  assert.equal(I18N.es.lessons.length, 12);
});

test('the first step frames Jev as the System One model, with prose and a list of five uses', () => {
  for (const lang of ['es', 'en']) {
    const step = I18N[lang].lessons.find((l) => l.id === 'what');
    const text = step.theory.join(' ');
    assert.ok(/Sistema 1|System 1/.test(text) && !text.includes('Kahneman') && !text.includes('System One'), lang);
    assert.equal(step.table, undefined, lang);
    assert.equal(step.list.length, 5, lang);
  }
});

test('only the similar projects step starts collapsed behind a details toggle that points to the PDF', () => {
  for (const lang of ['es', 'en']) {
    assert.deepEqual(I18N[lang].lessons.filter((l) => l.collapsed).map((l) => l.id), ['similar'], lang);
    assert.ok(I18N[lang].detailToggle && /PDF/.test(I18N[lang].detailNote), lang);
  }
});

test('the architecture dropdown has four boxes joined by three links in both languages', () => {
  for (const lang of ['es', 'en']) {
    const { arch, archLinks } = I18N[lang];
    assert.equal(arch.length, 4, lang);
    assert.equal(archLinks.length, 3, lang);
    assert.ok(arch.some((b) => b.name === 'Vercel AI Gateway'), lang);
    assert.ok(arch.some((b) => b.name.includes('TypeSafe')), lang);
    assert.deepEqual(I18N[lang].lessons.filter((l) => l.boxes).map((l) => l.id), ['flow'], lang);
    assert.equal(I18N[lang].lessons.findIndex((l) => l.id === 'flow'), 1, lang);
    assert.ok(!I18N[lang].lessons.some((l) => l.arch) && !('archToggle' in I18N[lang]), lang);
    assert.equal(I18N[lang].lessons.find((l) => l.id === 'flow').list.length, 2, lang);
  }
});

test('the fields step comes right before similar projects, which is last, and names every request and response field', () => {
  for (const lang of ['es', 'en']) {
    const L = I18N[lang].lessons;
    assert.deepEqual(L.slice(-2).map((l) => l.id), ['fields', 'similar'], lang);
    assert.ok(!L.some((l) => l.id === 'glossary'), lang);
    const other = I18N[lang === 'es' ? 'en' : 'es'].lessons.find((l) => l.id === 'fields');
    assert.deepEqual(L.find((l) => l.id === 'fields').tables.map((t) => t.rows.length), other.tables.map((t) => t.rows.length), lang);
    const names = L.find((l) => l.id === 'fields').tables.flatMap((t) => t.rows.map(([n]) => n));
    for (const f of ['state', 'questions', 'instructions', 'criteria', 'answers', 'probability', 'probabilities', 'usage', 'warnings', 'modelId', 'ms', 'confidence', 'cost']) assert.ok(names.includes(f), `${lang}: ${f}`);
  }
});

test('each part of a practice step shows the field name it has in the call', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  for (const [key, field] of [['step1', 'state'], ['step2', 'questions'], ['step3', 'answers']]) {
    assert.match(html, new RegExp(`data-i18n="${key}"></span> <code class="type-tag">${field}</code>`), key);
  }
  for (const field of ['instructions', 'criteria']) assert.ok(html.includes(`className: 'type-tag field', textContent: '${field}'`), field);
});

test('practice steps show the question type next to the title, taken from the question itself', () => {
  const want = {
    boolean: '"type": "boolean"', choice: '"type": "choice"', score: '"type": "score"',
    criteria: '"type": "choice" + criteria', multi: 'boolean · choice · score',
    guard: '"type": "boolean"', defects: '"type": "choice" + criteria',
  };
  for (const lang of ['es', 'en']) {
    const tags = Object.fromEntries(I18N[lang].lessons.map((l) => [l.id, typeTag(l)]).filter(([, tag]) => tag));
    assert.deepEqual(tags, want, lang);
  }
});

test('only the choice step suggests adding Phishing live, in both languages', () => {
  for (const lang of ['es', 'en']) {
    const withTry = I18N[lang].lessons.filter((l) => l.tryIt);
    assert.deepEqual(withTry.map((l) => l.id), ['choice'], lang);
    assert.ok(withTry[0].tryIt.includes('Phishing'), lang);
  }
});

test('the three question type steps say so in their title', () => {
  const titles = (lang) => ['boolean', 'choice', 'score'].map((id) => I18N[lang].lessons.find((l) => l.id === id).title);
  for (const t of titles('es')) assert.match(t, /^Pregunta de /, t);
  for (const t of titles('en')) assert.match(t, / question$/, t);
});
