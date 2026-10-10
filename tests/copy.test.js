import { test } from 'node:test';
import assert from 'node:assert/strict';
import { I18N, DOCS, resolve, docsFor } from '../copy.js';
import { costParts } from '../pricing.js';

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

test('docs have the same sections, in the same order, in es and en', () => {
  const ids = (lang) => DOCS[lang].map((d) => d.id);
  assert.deepEqual(ids('es'), ids('en'));
  DOCS.es.forEach((d, i) => assert.deepEqual(Object.keys(d).sort(), Object.keys(DOCS.en[i]).sort(), d.id));
});

test('an unknown language falls back to english', () => {
  assert.equal(resolve('fr').run, I18N.en.run);
  assert.equal(docsFor('fr'), DOCS.en);
});

test('a key missing in a language falls back to english without breaking', () => {
  const table = { en: { hello: 'Hello', bye: 'Bye' }, es: { hello: 'Hola' } };
  assert.deepEqual(resolve('es', table), { hello: 'Hola', bye: 'Bye' });
});

test('each language declares the locale used for numbers', () => {
  assert.equal(I18N.es.locale, 'es-AR');
  assert.equal(I18N.en.locale, 'en-US');
});

test('the UI says confianza, never "de seguridad", for a probability', () => {
  const values = Object.values(I18N.es).map((v) => (typeof v === 'function' ? v(98) : String(v)));
  assert.ok(!values.some((v) => v.includes('de seguridad')), 'found "de seguridad" in the es table');
  assert.equal(I18N.es.sure(98), '98% de confianza');
});

test('the cost footer composes count, seconds, tokens and estimated cost', () => {
  const { seconds, tokens, usd } = costParts({ ms: 1100, inputTokens: 6635 }, I18N.es.locale);
  assert.equal(I18N.es.costFooter(I18N.es.ticketsCount(15), seconds, tokens, usd), '15 tickets · 1,1 s · 6.635 tokens de entrada · US$0,00028 estimado');
});
