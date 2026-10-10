import { test } from 'node:test';
import assert from 'node:assert/strict';
import { I18N, DOCS, resolve, docsFor } from '../copy.js';

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
