import { test } from 'node:test';
import assert from 'node:assert/strict';
import { I18N, resolve } from '../copy.js';

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

test('the UI says confianza, never "de seguridad", for a probability', () => {
  const values = Object.values(I18N.es).map((v) => (typeof v === 'function' ? v(98) : String(v)));
  assert.ok(!values.some((v) => v.includes('de seguridad')), 'found "de seguridad" in the es table');
  assert.equal(I18N.es.sure(98), '98% de confianza');
});

test('the playground explains a yes/no answer and a scale answer in plain words', () => {
  assert.equal(I18N.es.explain.boolean(true, 98), 'Jev está 98% seguro de que sí. Arriba de 90% podrías automatizar; abajo, que lo mire una persona.');
  assert.match(I18N.es.explain.score('Enojado', 3, 4), /«Enojado» \(nivel 3 de 4\)/);
  assert.match(I18N.en.explain.choice('Shipping', 81), /“Shipping” with 81%/);
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
  for (const lang of ['es', 'en']) assert.equal(I18N[lang].lessons.find((l) => l.id === 'doubt')?.threshold, 0.9, lang);
});

test('the threshold note says whether a confidence would be automated or reviewed', () => {
  assert.equal(I18N.es.thresholdNote(58, false, 90), 'Confianza 58%: con un umbral de 90%, este ticket iría a revisión humana.');
  assert.equal(I18N.en.thresholdNote(97, true, 90), 'Confidence 97%: with a 90% threshold, this would be automated.');
});

test('the similar-projects step has the same rows and links in es and en, led by Clef and Strands Decider', () => {
  const table = (lang) => I18N[lang].lessons.find((l) => l.id === 'similar').table;
  const [es, en] = [table('es'), table('en')];
  assert.deepEqual(es.rows.map((r) => r[1]), en.rows.map((r) => r[1]));
  for (const t of [es, en]) for (const r of t.rows) assert.equal(r.length, t.head.length + 1);
  assert.deepEqual(es.rows.slice(0, 2).map((r) => r[0]), ['Cloudflare Clef', 'AWS Strands Decider 2B']);
});

test('the code step gives three commands and a runnable evaluate call with a 0.9 threshold', () => {
  for (const lang of ['es', 'en']) {
    const step = I18N[lang].lessons.find((l) => l.id === 'code');
    assert.equal(step.commands.length, 3, lang);
    for (const part of ['experimental_evaluate', "model: 'typesafe-ai/jev'", '>= 0.9']) assert.ok(step.code.includes(part), `${lang}: ${part}`);
  }
});

test('the glossary covers the same terms in es and en, with one definition each', () => {
  const rows = (lang) => I18N[lang].lessons.find((l) => l.id === 'glossary').table.rows;
  assert.equal(rows('es').length, rows('en').length);
  assert.deepEqual(rows('es').map((r) => r.length), rows('en').map((r) => r.length));
  for (const term of ['state', 'question', 'criteria', 'score', 'usage']) assert.ok(rows('es').some((r) => r[0] === term) && rows('en').some((r) => r[0] === term), term);
});

test('the when-to-use step has the same rows in es and en', () => {
  const step = (lang) => I18N[lang].lessons.find((l) => l.id === 'when');
  assert.equal(step('es').table.rows.length, step('en').table.rows.length);
  for (const lang of ['es', 'en']) for (const r of step(lang).table.rows) assert.equal(r.length, 3);
});
