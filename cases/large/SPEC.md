# Caso grande — la charla completa

Es la entrega que se juzga: la lección guiada, el snippet, el guion del presentador, el deck y el video de la charla del 2026-10-30, coherentes entre sí. No se prueba contra el server sino contra los artefactos del repo, porque eso es lo que llega a la sala y a quien no fue.

## Actores
- A1. Presentador — da la charla con la lección, el guion y el deck.
- A2. Asistentes — siguen la lección y copian el snippet.
- A3. Quien no pudo ir — ve el video.

## Requerimientos (de `docs/BRIEF.md`)
- R11: la lección tiene los mismos pasos en español y en inglés, e incluye los 7 que se dan en vivo.
- R15: el snippet del paso de código usa la API vigente del AI SDK.
- R20: hay un guion con una entrada por paso, y los pasos en vivo suman 15 minutos.
- R8: el deck lleva el título de la charla y existe en HTML y PDF.
- R10: el video dura 6 minutos o menos.

## Datos
- **Pasos:** los arrays `I18N.es.lessons` e `I18N.en.lessons` que exporta `copy.js`, leídos con `node`.
- **Pasos en vivo:** `what`, `boolean`, `criteria`, `multi`, `doubt`, `when`, `code`.
- **Título:** "Evaluar con Jev: de una pregunta cerrada a una decisión con probabilidad".
- **Guion:** `docs/GUION.md`, con un encabezado `### <id del paso>` por paso, en el orden de `copy.js`; los pasos en vivo llevan una línea `Tiempo: <N> min`.

## Ejemplos de aceptación
- AE1. **Covers R11.** Given `copy.js`, then `es` y `en` tienen 14 pasos con los mismos `id` en el mismo orden, y entre ellos están los 7 pasos en vivo.
- AE2. **Covers R15.** Given el paso `code`, then su campo `code` importa `experimental_decide` y no contiene `experimental_evaluate`.
- AE3. **Covers R20.** Given `docs/GUION.md`, then hay un `### <id>` por cada paso de `copy.js`, en el mismo orden, y las líneas `Tiempo:` de los pasos en vivo suman 15.
- AE4. **Covers R8.** Given `docs/deck.html`, then contiene el título de la charla, y existe `docs/deck.pdf` no vacío.
- AE5. **Covers R10.** Given `video/out/demo.mp4`, then existe y `ffprobe` informa una duración de 360 s o menos.

## Contrato de runtime
- **Entrada:** la ruta a la raíz del repo (`python3 cases/large/checks.py .`).
- **Requiere:** `node` (para leer `copy.js`) y `ffprobe` (para el video). Sin red.
- **Salida:** la línea resumen primero, después una línea por check; exit 0 si todo pasa, 1 si algo falla, 2 si falta el argumento.
