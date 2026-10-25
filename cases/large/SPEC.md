# Caso grande — la charla completa

Es la entrega que se juzga: la lección del playground, el snippet, el guion del video, el deck y el video de unos 20 minutos que se proyecta el 2026-10-30 antes de las preguntas, coherentes entre sí. No se prueba contra el server sino contra los artefactos del repo, porque eso es lo que llega a la sala y a quien no fue.

## Actores
- A1. Presentador — graba el video con el guion y el deck, y responde las preguntas.
- A2. Asistentes — ven el video, después abren el playground y copian el snippet.
- A3. Quien no pudo ir — ve el mismo video.

## Requerimientos (de `docs/BRIEF.md`)
- R11: la lección tiene los mismos pasos en español y en inglés, e incluye los 10 que muestra el video.
- R15: el snippet del paso de código usa la API vigente del AI SDK.
- R20: el guion del video dura unos 20 minutos hablados, y `docs/GUION.md` ubica cada paso en un bloque del video o fuera de él.
- R8: el deck lleva el título de la charla y existe en HTML y PDF.
- R10: el video dura 21 minutos o menos.

## Datos
- **Pasos:** los arrays `I18N.es.lessons` e `I18N.en.lessons` que exporta `copy.js`, leídos con `node`.
- **Pasos del video:** `what`, `boolean`, `choice`, `criteria`, `multi`, `doubt`, `when`, `guard`, `defects`, `code`.
- **Título:** "Evaluar con Jev: de una pregunta cerrada a una decisión con probabilidad".
- **Guion:** `video/script.tsv` (`beat`, `en` = subtítulo, `es` = lo que se dice) y `docs/GUION.md`, con un encabezado `### <id del paso>` por paso, en el orden de `copy.js`; los pasos del video llevan una línea `Bloque:` y el resto una `Fuera del video:`.

## Ejemplos de aceptación
- AE1. **Covers R11.** Given `copy.js`, then `es` y `en` tienen 15 pasos con los mismos `id` en el mismo orden, y entre ellos están los 10 pasos del video.
- AE2. **Covers R15.** Given el paso `code`, then su campo `code` importa `experimental_decide` y no contiene `experimental_evaluate`.
- AE3. **Covers R20.** Given `docs/GUION.md`, then hay un `### <id>` por cada paso de `copy.js`, en el mismo orden, cada paso del video con su línea `Bloque:` y el resto con `Fuera del video:`; y la columna `es` de `video/script.tsv` suma entre 2.700 y 3.100 palabras.
- AE4. **Covers R8.** Given `docs/deck.html`, then contiene el título de la charla, y existe `docs/deck.pdf` no vacío.
- AE5. **Covers R10.** Given `video/out/demo.mp4`, then existe y `ffprobe` informa una duración de 1260 s o menos.

## Contrato de runtime
- **Entrada:** la ruta a la raíz del repo (`python3 cases/large/checks.py .`).
- **Requiere:** `node` (para leer `copy.js`) y `ffprobe` (para el video). Sin red.
- **Salida:** la línea resumen primero, después una línea por check; exit 0 si todo pasa, 1 si algo falla, 2 si falta el argumento.
