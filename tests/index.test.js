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

test('styles use the DESIGN.md tokens instead of literals', () => {
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  const outside = css.replace(/:root\s*\{[\s\S]*?\n  \}/, '');
  assert.deepEqual(outside.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [], []);
  assert.deepEqual(outside.match(/border-radius:\s*(6px|10px|99px)/g) ?? [], []);
  assert.deepEqual(outside.match(/font-size:\s*(1\.6rem|1\.5rem|1\.4rem|1rem|\.9rem|\.8rem|13px)/g) ?? [], []);
  for (const token of ['--code-bg', '--code-fg', '--radius-sm', '--radius-md', '--radius-pill', '--fs-sm']) assert.ok(outside.includes(`var(${token})`), token);
});

test('an edit hint sits before the run button and changes for the multi step', () => {
  assert.match(html, /<p id="edit-hint" class="hint"><\/p>\s*<button id="run"/);
  assert.match(html, /\$\('edit-hint'\)\.textContent = isMulti\(\) \? t\(\)\.editHintMulti : t\(\)\.editHint;/);
});

test('a lesson can show several tables, each with an optional caption', () => {
  assert.match(html, /L\.tables \?\? \(L\.table \? \[L\.table\] : \[\]\)/);
  assert.match(html, /tbl\.caption/);
});

test('a subtle timer in the header shows on every step and can start, pause and reset', () => {
  const header = html.match(/<header>([\s\S]*?)<\/header>/)[1];
  for (const id of ['timer-time', 'timer-toggle', 'timer-reset']) assert.match(header, new RegExp(`id="${id}"`));
  assert.match(header, />00:00</);
  assert.match(html, /running\(\) \? t\(\)\.timerPause : t\(\)\.timerStart/);
  assert.match(html, /Date\.now\(\)/);
});
