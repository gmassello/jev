# Jev para devs — Plan

Source: `docs/BRIEF.md`, `docs/UX.md` · Deadline: 2026-10-22 15:00 -03:00 · Hours left at writing: 284.5

## Summary
Al terminar, el playground tiene una pestaña **Desafío** con 15 tickets de soporte etiquetados, marcador, umbral y costo por corrida, todo en local; hay un deck en español y un video corto para quien no esté. La unidad que desbloquea la demo es U2 (el dataset con sus etiquetas validadas contra Jev): sin ella el marcador no dice nada.

## Key technical decisions
- Desafío, enfoque, casos sintéticos, dominio tickets de soporte, presentador proyecta, todo en español — settled: inherited from BRIEF.
- Sin deploy: la charla corre en local por screen-share y el acceso asincrónico es el video — chosen over clave compartida en la app y Vercel Deployment Protection because el presentador lo eligió al resolver la pregunta abierta del BRIEF. R9 queda en cut. settled: user-directed
- El desafío reusa `POST /evaluate` desde el navegador, una llamada por ticket con concurrencia limitada (5), sin endpoint nuevo — chosen over un endpoint que corra el set en el server because no toca `server.js` y la medición de 15 llamadas dio 0 errores en ~1.1 s con concurrencia 15 y con 5. settled: plan-time
- El copy (`I18N`) y el precio por token salen de `index.html` a módulos ES importables desde el navegador y desde `node --test` — chosen over dejarlos inline because la regla común pide un test de paridad de claves ES/EN y "un solo lugar decide" para el precio. settled: plan-time
- El costo se calcula solo con el precio de entrada publicado (US$0.042 / M tokens de entrada); la página del modelo en AI Gateway no publica precio de salida (verificado el 2026-10-10), así que la UI lo rotula "costo estimado (entrada)" — chosen over inventar un precio de salida because toda cifra publicada sale de una fuente. settled: plan-time
- Tests con el runner nativo `node --test`, sin dependencias nuevas — chosen over vitest because la regla común prohíbe agregar dependencias. settled: plan-time
- Las etiquetas esperadas del dataset se validan con un script que corre el set contra Jev y guarda el resultado en un JSON; toda cifra de acierto que se publique (deck, video) sale de ese JSON — chosen over escribirlas a mano because la regla común exige que todo número publicado salga de un comando. settled: plan-time

## Units
### U1. Base: comandos, módulos de copy y precio, tests
- **Goal:** el repo tiene el bloque `## Commands` (instalar, correr en dev, suite, un solo test, lint, type-check, deploy) en `CLAUDE.md`; el copy ES/EN y el precio por token viven en módulos propios que usa `index.html`; corre una suite con `node --test`.
- **Covers:** — (habilita todas las demás)
- **Files:** `CLAUDE.md`, `index.html`, `copy.js`, `pricing.js`, `tests/copy.test.js`, `tests/pricing.test.js`, `package.json`
- **Depends on:** —
- **Status:** done
- **Tests:**
  - happy: las tablas ES y EN del copy → tienen exactamente las mismas claves, y toda clave `_tech` tiene su `_plain`.
  - happy: 1.000.000 de tokens de entrada → costo US$0.042; 6635 tokens → ~US$0.00028, rotulado como estimado de entrada.
  - edge: un idioma desconocido o una clave faltante en ES → cae a la de EN sin romper.
  - error: tokens indefinidos (el gateway no devolvió usage) → el costo se muestra como "—", no como NaN.

### U2. Dataset de 15 tickets de soporte con etiquetas validadas
- **Goal:** existen 15 tickets sintéticos en español, cada uno con la respuesta esperada para cada pregunta sugerida (área, ¿pide reembolso?, urgencia y la pregunta de conteo "¿cuántos productos distintos menciona?", que pone a prueba una limitación documentada), y un script que corre el set contra Jev y guarda aciertos, confianza, tokens y tiempo en un JSON de resultados.
- **Covers:** R1, R3 · F1
- **Files:** `challenge/tickets.js`, `challenge/score.js` (adelantado de U3: el script ya necesita juzgar aciertos), `scripts/run-challenge.mjs`, `challenge/results.json`, `tests/tickets.test.js`, `tests/score.test.js`
- **Depends on:** U1
- **Status:** done
- **Tests:**
  - happy: el set → tiene 15 tickets, todos con texto en español y una etiqueta esperada válida para cada pregunta sugerida. Covers AE1.
  - happy: el script corrido contra Jev → escribe un JSON con aciertos por pregunta, confianza por ticket, tokens totales y tiempo.
  - edge: la pregunta de conteo → queda registrada como corrida `trap` con su resultado medido (aciertos y confianza por ticket), sin exigir una falla. Covers AE3.
  - edge: se editan los tickets y no se vuelve a correr el script → el test detecta que `results.json` quedó desactualizado (ids o esperados distintos).
  - error: una etiqueta esperada que no está entre las opciones de la pregunta → el test de forma falla nombrando el ticket.

### U3. Pestaña Desafío: correr el set y mostrar el marcador
- **Goal:** la pestaña Desafío abre por defecto con el set precargado y una pregunta; "Evaluar los 15 tickets" corre las llamadas con progreso visible fila por fila y termina con el marcador N/15 y las filas falladas resaltadas con respuesta de Jev, esperada y confianza.
- **Covers:** R1, R2, R3 · F1
- **Files:** `index.html`, `challenge/score.js`, `challenge/pool.js` (compartido con el script de U2), `copy.js`, `server.js` (módulos permitidos), `tests/score.test.js`, `tests/pool.test.js`
- **Depends on:** U1, U2
- **Status:** done
- **Tests:**
  - happy: 15 respuestas con 12 coincidencias contra la esperada → marcador 12/15 y 3 filas marcadas como fallo, cada una con respuesta, esperada y confianza. Covers AE2.
  - edge: la pregunta queda vacía → el CTA se deshabilita y aparece la ayuda "Escribí una pregunta para evaluar los tickets."
  - edge: preguntas `boolean` y `choice` → el acierto se calcula con el umbral 0.5 para boolean y con la key ganadora para choice.
  - error: una llamada falla → esa fila muestra "Jev no respondió este ticket. Reintentar." y el marcador cuenta sobre los tickets que sí respondieron.

### U4. Umbral de confianza
- **Goal:** con el marcador cargado, un slider de 0.5 a 0.95 recalcula al instante, sin volver a llamar a Jev, cuántos tickets se automatizan, cuántos van a revisión humana y cuántos errores se automatizarían.
- **Covers:** R4 · F2
- **Files:** `index.html`, `challenge/score.js`, `copy.js`, `tests/score.test.js`
- **Depends on:** U3
- **Status:** done
- **Tests:**
  - happy: los mismos resultados con umbral 0.5 y después 0.9 → baja la cantidad de automáticos, sube la de revisión, y no se hace ninguna llamada nueva. Covers AE4.
  - edge: umbral en el extremo (0.95) con todas las confianzas debajo → 0 automáticos, 15 a revisión, 0 errores automatizados.
  - edge: una fila fallada con confianza sobre el umbral → cuenta como "error que se automatizaría".

### U5. Costo, tiempo, JSON y "confianza"
- **Goal:** cada corrida (Desafío y Playground) muestra tickets o preguntas, segundos, tokens y costo en US$ calculado con el módulo de precio; un botón "Ver JSON" muestra request y respuesta junto a los resultados; la UI dice "confianza" en vez de "seguridad" y enlaza "¿Cómo leer esto?" a Docs.
- **Covers:** R5 · F2
- **Files:** `index.html`, `copy.js`, `pricing.js`, `tests/pricing.test.js`
- **Depends on:** U1
- **Status:** todo
- **Tests:**
  - happy: una corrida del desafío terminada → el pie muestra 15 tickets, el tiempo total, los tokens sumados y el costo en US$ que da el módulo de precio para esos tokens. Covers AE5.
  - happy: "Ver JSON" → muestra el último request y la última respuesta sin salir de la pantalla.
  - edge: el copy → no queda ninguna aparición de "de seguridad" en la tabla ES.

### U6. Toggles de tema y registro, y modo proyector
- **Goal:** el header ofrece Tema (claro/oscuro), Registro (técnico/para dummies, arranca en dummies) y Modo proyector (texto más grande); el tema se aplica antes de la primera pintada y los tres se recuerdan.
- **Covers:** — (UX hallazgo 4; regla común de tres toggles)
- **Files:** `index.html`, `copy.js`, `tests/copy.test.js`
- **Depends on:** U1
- **Status:** todo
- **Tests:**
  - happy: registro en dummies → la intro del desafío usa `challengeIntro_plain`; en técnico, `challengeIntro_tech`; los valores medidos y el código no cambian.
  - edge: sin preferencia guardada → el tema sigue a `prefers-color-scheme`.
  - error: `localStorage` bloqueado → la página carga igual con los defaults.

### U7. Demo deployada y protegida
- **Goal:** la demo está publicada en una URL que solo puede usar quien tiene acceso.
- **Covers:** R9 · F4
- **Files:** —
- **Depends on:** —
- **Status:** todo
- **Tests:**
  - error: alguien sin acceso abre la URL → no puede llamar a Jev. Covers AE6.

### U8. Deck en español
- **Goal:** `docs/deck.html` y `docs/deck.pdf` en español cubren qué es Jev, Jev vs. LLMs, System One, el desafío, integración (con el snippet probado), costo, riesgos y la consigna de caso propio; toda cifra sale de `challenge/results.json` o de la medición del costo.
- **Covers:** R6, R7, R8 · F3
- **Files:** `docs/deck.html`, `docs/deck.pdf`
- **Depends on:** U2
- **Status:** todo
- **Tests:**
  - happy: el PDF → existe, tiene 1920×1080 por página y contiene las secciones de R8.
  - happy: cada cifra del deck → coincide con la de `challenge/results.json`.
  - edge: la consigna de caso propio → es la última slide antes del cierre.

### U9. Video corto en español
- **Goal:** un screencast narrado en español recorre el desafío (pregunta, marcador, resultado de la pregunta de conteo, umbral, costo) y cierra con dónde ver el snippet; es el acceso asincrónico, porque no hay deploy.
- **Covers:** R10 · F4
- **Files:** `docs/video/` (guion, audio, mp4)
- **Depends on:** U3, U4, U5
- **Status:** todo
- **Tests:**
  - happy: el mp4 → muestra el marcador ya asentado (sin animación a medio camino) con la misma cifra que `challenge/results.json`.
  - edge: la narración → está en español y no usa cifras que no estén en el JSON de resultados.

### U10. Snippet de integración ejecutable
- **Goal:** el snippet de la pestaña Docs existe como archivo ejecutable y un comando lo corre contra Jev, para que "pueden integrarlo solos" se apoye en algo que anda tal cual.
- **Covers:** R6 · F3
- **Files:** `examples/evaluate.mjs`, `tests/snippet.test.js`
- **Depends on:** U1
- **Status:** todo
- **Tests:**
  - happy: el texto del snippet en Docs → es idéntico al de `examples/evaluate.mjs`.
  - happy: correr el ejemplo con la key → imprime una probabilidad entre 0 y 1.
  - error: sin `AI_GATEWAY_API_KEY` → falla con el mensaje de autenticación del gateway, no con un stack trace mudo.

## Cut line
| Tier | Units | Why |
|---|---|---|
| must | U1, U2, U3, U4, U5, U8, U9 | sin el dataset, el desafío, el umbral y el costo no hay charla; el deck es el soporte de la charla y el video es el único acceso asincrónico |
| should | U6, U10 | suman legibilidad en la sala y respaldo a "Pueden integrarlo solos", pero el snippet ya fue probado a mano y la UI ya se lee |
| cut | U7 | el presentador eligió no deployar; R9 queda sin cubrir y AE6 no se ejecuta |

## Risks
- La red de la sala no llega al gateway — likelihood: media — mitigation: probar la red el día anterior desde la sala — fallback: mostrar el video (U9) y las cifras de `challenge/results.json`.
- Rate limit o error del gateway con 15 llamadas seguidas — likelihood: baja (medido: 0 errores con concurrencia 15 y 5) — mitigation: concurrencia 5 y reintento por fila — fallback: las filas fallidas muestran "Reintentar" y el marcador cuenta sobre las que respondieron.
- ~~Jev acierta la trampa de conteo y no se ve la falla~~ — ocurrió en U2 (15/15). Resuelto: R3 muestra el dato medido; las fallas reales del set (área y urgencia) y la confianza baja cargan el mensaje de "no confíes ciegamente".
- `experimental_evaluate` cambia en una versión nueva de `ai` — likelihood: baja — mitigation: pinnear `ai` a la versión exacta instalada (regla común de dependencias) en U1.
- El costo real es mayor que el estimado si AI Gateway cobra tokens de salida — likelihood: media — mitigation: rotular el costo como estimado de entrada y contrastarlo con el consumo del dashboard de AI Gateway después de una corrida — fallback: decir en la charla que es una cota inferior.
- Los tokens y el costo cambian entre corridas — likelihood: alta — mitigation: el deck y el video toman las cifras del JSON de una corrida y lo dicen; en vivo se muestran las de esa corrida.

## Out of scope
- Que cada asistente juegue el desafío en su navegador; ranking entre asistentes (BRIEF, Para después).
- Integrar Jev en código propio en vivo; datos reales del equipo; keys individuales; comparación en vivo contra un LLM (BRIEF, Fuera de este producto).
- Cargar un set de tickets propio o subir un CSV; varias preguntas a la vez en el desafío (`docs/UX.md`, Out of scope).
- Deploy de la demo (U7, cut).
