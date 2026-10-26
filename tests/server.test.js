import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';

const freePort = () => new Promise((resolve) => {
  const srv = createServer().listen(0, () => { const { port } = srv.address(); srv.close(() => resolve(port)); });
});

let child;
let base;
const basic = (pass) => ({ authorization: `Basic ${Buffer.from(`x:${pass}`).toString('base64')}` });

before(async () => {
  const port = await freePort();
  base = `http://localhost:${port}`;
  child = spawn(process.execPath, ['server.js'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, PORT: String(port), ACCESS_PASSWORD: 'secreto', AI_GATEWAY_API_KEY: '' },
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  await new Promise((resolve) => child.stdout.once('data', resolve));
});

after(() => child.kill());

test('without credentials the page asks for basic auth', async () => {
  const res = await fetch(base);
  assert.equal(res.status, 401);
  assert.match(res.headers.get('www-authenticate') ?? '', /^Basic /);
});

test('a wrong password is rejected', async () => {
  assert.equal((await fetch(base, { headers: basic('otra') })).status, 401);
});

test('the right password serves the playground', async () => {
  const res = await fetch(base, { headers: basic('secreto') });
  assert.equal(res.status, 200);
  assert.match(await res.text(), /<title>/);
});

test('evaluate without credentials never reaches Jev', async () => {
  const res = await fetch(`${base}/evaluate`, { method: 'POST', body: '{}' });
  assert.equal(res.status, 401);
});
