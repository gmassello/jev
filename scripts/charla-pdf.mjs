import { writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).href.replace(/\/$/, '');
const out = process.argv[2];
const base = process.env.BASE_URL ?? 'http://localhost:3001';
const { I18N, typeTag, costSplit } = await import(`${root}/copy.js`);
const lessons = I18N.es.lessons;

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const compact = (v, pad = '') => {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  const flat = JSON.stringify(v);
  if (flat.length <= 72) return flat.replace(/,"/g, ', "').replace(/":/g, '": ');
  const inner = pad + '  ';
  const items = Array.isArray(v) ? v.map((x) => inner + compact(x, inner)) : Object.entries(v).map(([k, x]) => `${inner}${JSON.stringify(k)}: ${compact(x, inner)}`);
  return `${Array.isArray(v) ? '[' : '{'}\n${items.join(',\n')}\n${pad}${Array.isArray(v) ? ']' : '}'}`;
};
const num = (p) => p.toFixed(2).replace('.', ',');

const toQuestion = (q) => {
  const o = { type: q.type, instructions: q.text };
  const pairs = q.options.map((x, i) => [x, q.descriptions?.[i] ?? null]);
  if (q.type === 'choice') o.criteria = Object.fromEntries(pairs);
  if (q.type === 'score') o.criteria = pairs.map(([x]) => x);
  return o;
};

const ask = async (state, qs) => {
  const body = { state, questions: Object.fromEntries(qs.map((q) => [q.id, toQuestion(q)])) };
  const r = await fetch(`${base}/evaluate`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const res = await r.json();
  if (!r.ok) throw new Error(res.error);
  return { res, body };
};

const bars = (rows) => `<div class="bars">${rows.map(([label, p, on]) => `<div class="bar${on ? ' on' : ''}"><span class="l">${esc(label)}</span><span class="t"><i style="width:${Math.round(p * 100)}%"></i></span><span class="v">${num(p)}</span></div>`).join('')}</div>`;

const answerHtml = (q, a) => {
  if (q.type === 'boolean') return `<p class="verdict">${esc(I18N.es.sure(a.probability))}</p>${bars([['Sí', a.probability, true]])}`;
  if (q.type === 'choice') {
    const rows = q.options.map((o) => [o, a.probabilities[o] ?? 0, o === a.choice]);
    return `<p class="verdict">Elige «${esc(a.choice)}» con ${num(a.probabilities[a.choice])}</p>${bars(rows)}`;
  }
  const rows = q.options.map((o, i) => [o, a.probabilities[String(i)] ?? 0, false]);
  return `<p class="verdict">Score ${num(a.score)} (contando desde 0): cerca de «${esc(q.options[Math.round(a.score)])}»</p>${bars(rows)}`;
};

const table = (t) => `${t.caption ? `<p>${esc(t.caption)}</p>` : ''}<table><thead><tr>${t.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(([label, link, ...cells]) => `<tr><td><b>${link ? `<a href="${esc(link)}">${esc(label)}</a>` : esc(label)}</b></td>${cells.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

const run = async (state, qs, label, fix) => {
  const { res, body } = await ask(state, qs);
  let h = `<div class="box">${label ? `<div class="ex">Ejemplo: ${esc(label)}</div>` : ''}<div class="k">El texto · state</div><p class="state">${esc(state)}</p>`;
  for (const q of qs) {
    h += `<div class="k">La pregunta · questions</div><p><b>${esc(q.text)}</b>${q.options?.length ? ` <span class="raw">· ${q.options.map((o, j) => esc(o) + (q.descriptions?.[j] ? `: ${esc(q.descriptions[j])}` : '')).join(' · ')}</span>` : ''}</p>`;
    h += `<div class="k">La respuesta de Jev · answers</div>${answerHtml(q, res.answers[q.id])}`;
  }
  if (fix) h += `<div class="k">Qué hacer</div><p>${esc(fix)}</p>`;
  h += `${res.cost != null ? `<p style="font-weight:700;color:#2a62d9;margin:.6em 0 0">${esc(I18N.es.costScale(res.cost))}</p>` : ''}<p class="foot" style="white-space:pre-line">${esc(I18N.es.footer({ input: res.usage?.inputTokens, output: res.usage?.outputTokens, ...costSplit(res.usage, res.cost ?? null), cost: res.cost ?? null, modelId: res.modelId, ms: res.ms }))}</p></div>`;
  const shown = { answers: res.answers, usage: res.usage, modelId: res.modelId, ms: res.ms, confidence: res.confidence, cost: res.cost };
  return h + `<div class="call"><div class="k">La llamada al modelo</div><pre>POST /evaluate\n${esc(compact(body))}</pre><div class="k">Lo que devolvió</div><pre>${esc(compact(shown))}</pre></div>`;
};

const sections = [];
for (const [i, L] of lessons.entries()) {
  let h = `<section><div class="n">Paso ${i + 1} de ${lessons.length}</div><h2>${esc(L.title)}${typeTag(L) ? ` <code style="font-size:.6em;background:#2a62d922;padding:.1em .4em;border-radius:4px">${esc(typeTag(L))}</code>` : ''}</h2>`;
  h += (L.theory ?? []).map((p) => `<p>${esc(p)}</p>`).join('');
  for (const t of L.tables ?? (L.table ? [L.table] : [])) h += table(t);
  if (L.boxes) { const E = I18N.es; h += `<pre>${esc(E.arch.map((b, i) => `${i ? `   ↓ ${E.archLinks[i - 1]}\n` : ''}[${b.name}]\n  ${b.detail}`).join('\n'))}</pre>`; }
  if (L.diagram) h += `<pre>${esc(L.diagram)}</pre>`;
  if (L.list) h += `<ul>${L.list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  if (L.commands) h += `<pre>${esc(L.commands.join('\n'))}</pre>`;
  if (L.code) h += `<pre>${esc(L.code)}</pre>`;
  if (L.examples) {
    for (const e of L.examples) h += await run(e.state, [{ id: 'q1', ...e.question }], e.label, e.fix);
  } else if (L.state) {
    h += await run(L.state, L.questions ?? [{ id: 'q1', ...L.question }]);
  }
  if (L.outro) h += `<p class="outro">${esc(L.outro)}</p>`;
  sections.push(h + '</section>');
}

const date = new Date().toISOString().slice(0, 10);
writeFileSync(out, `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Evaluar con Jev</title><style>
@page { size: A4; margin: 16mm 15mm; }
body { font: 11pt/1.45 system-ui, sans-serif; color: #1a1a1a; }
h1 { font-size: 22pt; margin: 0 0 4pt; } h2 { font-size: 15pt; margin: 2pt 0 8pt; }
.cover { break-after: page; padding-top: 60mm; } .cover p { color: #666; }
section { break-before: page; } section:first-of-type { break-before: auto; }
.n { color: #666; font-size: 9pt; } .k { font-weight: 600; font-size: 9pt; color: #666; margin-top: 8pt; }
.ex { font-weight: 700; color: #2a62d9; margin-top: 2pt; }
.box { border: 1px solid #ddd; border-radius: 8px; padding: 6pt 10pt; margin: 8pt 0; break-inside: avoid; }
.state { margin: 2pt 0; } .raw { color: #666; font-size: 9pt; } .foot { color: #666; font-size: 8.5pt; margin: 3pt 0 0; }
.verdict { color: #157a40; font-weight: 700; margin: 2pt 0 4pt; }
.bar { display: grid; grid-template-columns: 30% 1fr 3em; gap: 6pt; align-items: center; font-size: 9.5pt; margin: 2pt 0; }
.bar .t { background: #eee; height: 7pt; border-radius: 4pt; overflow: hidden; } .bar i { display: block; height: 100%; background: #9bb5ee; }
.bar.on i { background: #2a62d9; } .bar .v { text-align: right; font-variant-numeric: tabular-nums; }
table { border-collapse: collapse; width: 100%; font-size: 9.5pt; margin: 6pt 0; } th, td { text-align: left; vertical-align: top; padding: 3pt 5pt; border-bottom: 1px solid #ddd; }
.call { break-inside: auto; } .call pre { font-size: 7.5pt; }
pre { background: #101010; color: #f5f6f7; padding: 8pt; border-radius: 6pt; font-size: 8.5pt; white-space: pre-wrap; }
a { color: #2a62d9; } .outro { font-style: italic; }
</style></head><body>
<div class="cover"><h1>Evaluar con Jev</h1><h2>De una pregunta cerrada a una decisión con probabilidad</h2>
<p>Charla interna · viernes 30/10/2026, 12:00 · Germán Massello</p>
<p>Los ${lessons.length} pasos del playground, en el orden de la charla. Las respuestas de Jev son de una corrida real del ${date}; en vivo los números pueden variar un poco.</p>
<p>Repo: <a href="https://github.com/gmassello/jev">github.com/gmassello/jev</a></p></div>
${sections.join('\n')}
</body></html>`);
console.log(`ok ${sections.length} pasos`);
