# Caso grande — la charla completa

Es la entrega que se juzga: el desafío con los 15 tickets, el deck y el video, coherentes entre sí. No se prueba contra el server sino contra los artefactos del repo, porque eso es lo que llega a la sala y a quien no fue.

## Actores
- A1. Presentador — da la charla con el deck y el desafío.
- A2. Asistentes — ven el marcador y el deck.
- A3. Quien no pudo ir — ve el video.

## Requerimientos (de `docs/BRIEF.md`)
- R1, R2, R3: el desafío con 15 tickets, marcador y la pregunta de conteo, registrado en `challenge/results.json`.
- R5: cada corrida registra tokens y tiempo.
- R8: el deck en español, en HTML y PDF 16:9.
- R10: el video en español.

## Ejemplos de aceptación
- AE1. **Covers R1, R2.** Given `challenge/results.json`, then cada corrida tiene `total` = 15, 15 filas, y `correct` es igual a la cantidad de filas con `ok` verdadero.
- AE2. **Covers R3.** Given `challenge/results.json`, then existe una corrida marcada `trap: true` (la pregunta que pone a prueba una limitación documentada) con sus 15 filas y la confianza de cada una; no se exige una falla.
- AE3. **Covers R5.** Given cada corrida, then `tokens` y `ms` son enteros > 0.
- AE4. **Covers R8.** Given `docs/deck.pdf`, then existe y sus páginas son 16:9; `docs/deck.html` tiene `lang="es"` y muestra al menos un marcador `<correct>/15` que coincide con una corrida de `challenge/results.json`.
- AE5. **Covers R10.** Given `docs/video/`, then hay al menos un `.mp4` no vacío.

## Contrato de los artefactos
- **`challenge/results.json`:** `{ "runs": [ { "question": "<id>", "trap": bool, "total": 15, "correct": int, "tokens": int, "outputTokens": int, "ms": int, "rows": [ { "id": "<ticket>", "expected": "<label>", "answer": "<label>", "confidence": number, "ok": bool } ] } ] }`. Lo escribe `scripts/run-challenge.mjs` (PLAN U2).
- **`docs/deck.pdf` y `docs/deck.html`:** los genera `hackathon-deck` (PLAN U8).
- **`docs/video/*.mp4`:** lo genera `hackathon-record-video` (PLAN U9).
- **Entrada de los checks:** la ruta del repo, no una URL.
