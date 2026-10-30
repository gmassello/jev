import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { timingSafeEqual } from 'node:crypto';
import { experimental_decide as decide } from 'ai';

const PORT = process.env.PORT ?? 3001;
const MODEL = process.env.JEV_MODEL ?? 'typesafe-ai/jev';

const MODULES = new Set(['/copy.js']);
const ACCESS = process.env.ACCESS_PASSWORD;

const allowed = (req) => {
  if (!ACCESS) return true;
  const [scheme, encoded = ''] = (req.headers.authorization ?? '').split(' ');
  const pass = Buffer.from(Buffer.from(encoded, 'base64').toString().split(':').slice(1).join(':'));
  const want = Buffer.from(ACCESS);
  return scheme === 'Basic' && pass.length === want.length && timingSafeEqual(pass, want);
};

const send = (res, status, body, type = 'application/json') => {
  res.writeHead(status, { 'content-type': type });
  res.end(type === 'application/json' ? JSON.stringify(body, null, 2) : body);
};

createServer(async (req, res) => {
  if (!allowed(req)) {
    res.writeHead(401, { 'www-authenticate': 'Basic realm="jev"', 'content-type': 'text/plain' });
    return res.end('unauthorized');
  }
  if (req.method === 'GET' && req.url === '/') {
    return send(res, 200, await readFile(new URL('./index.html', import.meta.url)), 'text/html');
  }
  if (req.method === 'GET' && MODULES.has(req.url)) {
    return send(res, 200, await readFile(new URL(`.${req.url}`, import.meta.url)), 'text/javascript');
  }
  if (req.method === 'POST' && req.url === '/evaluate') {
    try {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const { state, questions } = JSON.parse(raw);
      const started = Date.now();
      const result = await decide({ model: MODEL, state, questions });
      return send(res, 200, {
        answers: result.answers,
        usage: result.usage,
        warnings: result.warnings,
        modelId: result.response.modelId,
        ms: Date.now() - started,
        confidence: result.providerMetadata?.typesafe?.confidence ?? null,
        cost: Number.isFinite(Number(result.providerMetadata?.gateway?.cost)) ? Number(result.providerMetadata.gateway.cost) : null,
      });
    } catch (error) {
      return send(res, 500, { error: error.message });
    }
  }
  send(res, 404, { error: 'not found' });
}).listen(PORT, () => console.log(`http://localhost:${PORT} → ${MODEL}`));
