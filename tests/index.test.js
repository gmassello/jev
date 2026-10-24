import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('stepper dots are buttons that jump to their step', () => {
  const render = html.match(/\$\('dots'\)\.replaceChildren\(([\s\S]*?)\)\);\n/)?.[1] ?? '';
  assert.match(render, /h\('button'/);
  assert.match(render, /onclick: \(\) => go\(i\)/);
  assert.match(render, /title: /);
  assert.match(render, /ariaLabel: /);
  assert.doesNotMatch(html, /id="dots"[^>]*aria-hidden/);
});
