import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { experimental_evaluate as evaluate } from 'ai';

const PORT = process.env.PORT ?? 3000;
const MODEL = process.env.JEV_MODEL ?? 'typesafe-ai/jev';

const send = (res, status, body, type = 'application/json') => {
  res.writeHead(status, { 'content-type': type });
  res.end(type === 'application/json' ? JSON.stringify(body, null, 2) : body);
};

createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    return send(res, 200, await readFile(new URL('./index.html', import.meta.url)), 'text/html');
  }
  if (req.method === 'POST' && req.url === '/evaluate') {
    try {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const { state, questions } = JSON.parse(raw);
      const started = Date.now();
      const result = await evaluate({ model: MODEL, state, questions });
      return send(res, 200, {
        answers: result.answers,
        usage: result.usage,
        warnings: result.warnings,
        modelId: result.response.modelId,
        ms: Date.now() - started,
      });
    } catch (error) {
      return send(res, 500, { error: error.message });
    }
  }
  send(res, 404, { error: 'not found' });
}).listen(PORT, () => console.log(`http://localhost:${PORT} → ${MODEL}`));
