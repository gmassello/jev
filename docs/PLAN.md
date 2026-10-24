# Jev para devs — Plan

Source: `docs/BRIEF.md`, `docs/UX.md`, `docs/ARCHITECTURE.md` · Deadline: 2026-10-30 12:00 -03:00 · Hours left at writing: 137.5 (revisado el 2026-10-24; la versión del 2026-10-10 tenía 284.5 al 22/10)

## Summary
Al terminar, el playground es una lección guiada de 13 pasos que se recorre en vivo en 15 minutos (7 pasos), con probabilidad, confianza y costo que vienen del gateway, el snippet con la API vigente del AI SDK, un deck nuevo, una demo grabada de hasta 6 minutos y el guion del presentador por paso. El desafío (U2–U5) se construyó y se retiró el 2026-10-12. Las unidades que desbloquean la charla son U14 (lo que la lección dice de la confianza) y U12 (saltar a los pasos en vivo).

## Key technical decisions
- Lección guiada en lugar del desafío, charla de 25 minutos (15 + 6 + 4) con 7 pasos en vivo, opción A de arquitectura (AI Gateway + AI SDK) — settled: inherited from BRIEF y `docs/ARCHITECTURE.md` (2026-10-24). Las decisiones de abajo sobre el desafío quedan como historia.
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
- **Status:** done
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
- **Files:** `docs/deck.html`, `docs/deck.pdf`, `docs/deck-desafio.png`
- **Depends on:** U2
- **Status:** done
- **Tests:**
  - happy: el PDF → existe, tiene 1920×1080 por página y contiene las secciones de R8.
  - happy: cada cifra del deck → coincide con la de `challenge/results.json`.
  - edge: la consigna de caso propio → es la última slide antes del cierre.

### U9. Video corto en español
- **Goal:** una demo grabada de hasta 6 minutos, en español, narrada por un avatar con la voz clonada del presentador (HeyGen) y declarada como tal, recorre la lección; se proyecta en la charla y queda para quien no estuvo. (Reescrita el 2026-10-24: antes recorría el desafío.)
- **Covers:** R10 · F5
- **Files:** `video/script.tsv`, `video/out/demo.mp4`, `docs/AI_DISCLOSURE.md`
- **Depends on:** U12, U14, U15, U16, U17
- **Status:** todo
- **Tests:**
  - happy: el video final → dura 6 minutos o menos (`ffprobe`). Covers AE10.
  - edge: cada cifra de los subtítulos → coincide con la salida de `demo-check`.

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

### U11. Lección guiada de 13 pasos
- **Goal:** el playground es una lección paso a paso, bilingüe, con un tema y un tipo de respuesta por paso: qué es, sí/no, opción, escala, opciones con definición, todo junto, cuando Jev duda (umbral 0,9), cuándo usarlo, proyectos parecidos, glosario, arquitectura, Jev en tu sistema y código; reemplaza al desafío.
- **Covers:** R11, R12, R13, R14, R19 · F5
- **Files:** `index.html`, `copy.js`, `tests/copy.test.js`, `scripts/demo-check.mjs`
- **Depends on:** U1
- **Status:** done
- **Tests:**
  - happy: un paso de práctica → "Preguntarle a Jev" muestra la respuesta, la probabilidad de cada opción y la explicación (verificado en Chrome con llamadas reales). Covers AE7.
  - happy: el paso "Cuando Jev duda" → `node scripts/demo-check.mjs --check` lo da por debajo de 0,9 con el aviso de revisión humana. Covers AE8.
  - happy: los pasos de arquitectura y producción → el test de forma exige las tres opciones, la compuerta y la versión fija `jev-1.14.0` en es y en. Covers AE12.
  - edge: un idioma con una clave o un paso de menos → el test de paridad falla.

### U12. Saltar a un paso
- **Goal:** los puntos del stepper llevan directo a cada paso, con el título como tooltip, para recorrer en vivo los 7 pasos de la charla sin pasar por los otros.
- **Covers:** R11 · F5
- **Files:** `index.html`
- **Depends on:** U11
- **Status:** done
- **Tests:**
  - happy: clic en el séptimo punto → se abre "Cuando Jev duda" y el paso queda guardado.
  - edge: teclado → cada punto es un botón con su nombre accesible.

### U13. Deck nuevo
- **Goal:** `docs/deck.html` y `docs/deck.pdf` con el título "Evaluar con Jev: de una pregunta cerrada a una decisión con probabilidad" acompañan los 15 minutos de lección: qué es Jev, Jev vs. LLMs, probabilidad y confianza, integración, costo, riesgos y la consigna de caso propio; sin el desafío ni System One.
- **Covers:** R7, R8 · F3, F5
- **Files:** `docs/deck.html`, `docs/deck.pdf`
- **Depends on:** U14, U15
- **Status:** todo
- **Tests:**
  - happy: el PDF → existe, 1920×1080 por página, con el título nuevo en la portada.
  - edge: cada cifra del deck → sale de `demo-check` o de la respuesta del gateway (costo), no se escribe a mano.

### U14. Probabilidad, confianza y costo desde el gateway
- **Goal:** `/evaluate` devuelve también la confianza de TypeSafe y el costo de la llamada que trae el gateway; la UI llama "probabilidad" a lo que hoy dice confianza, muestra la confianza aparte cuando llega, y un pie con tokens, costo en US$, versión del modelo y tiempo.
- **Covers:** R16 · F5
- **Files:** `server.js`, `index.html`, `copy.js`, `tests/copy.test.js`, `cases/small/checks.py`
- **Depends on:** U11
- **Status:** done
- **Tests:**
  - happy: el paso "Cuando Jev duda" → muestra la probabilidad de cada opción y la confianza como valores distintos (spike S2: 0,68 y 0,52). Covers AE11.
  - edge: el gateway no devuelve la confianza → la UI muestra solo la probabilidad, sin hueco ni "undefined".
  - error: sin costo en la respuesta → el pie muestra "—".

### U15. API vigente del AI SDK
- **Goal:** `ai` sube a 7.0.153 en versión exacta y el server, el snippet del último paso y `demo-check` usan `experimental_decide`.
- **Covers:** R6, R15 · F3
- **Files:** `package.json`, `package-lock.json`, `server.js`, `copy.js`, `scripts/demo-check.mjs`
- **Depends on:** U11
- **Status:** todo
- **Tests:**
  - happy: el snippet copiado del último paso, con la key, corrido con node → imprime "Rutear a cuenta". Covers AE9.
  - happy: `npm test`, `python3 cases/small/checks.py` y `demo-check` → en verde con la versión nueva.
  - error: sin `AI_GATEWAY_API_KEY` → el snippet falla con el mensaje de autenticación del gateway.

### U16. Riesgos en "Cuándo usar Jev"
- **Goal:** el paso "Cuándo usar Jev y cuándo no" suma tres riesgos para producción: el texto que entra no es de confianza, Jev prefiere la primera opción, y números, fechas y conteos se resuelven en código.
- **Covers:** R17 · F5
- **Files:** `copy.js`, `tests/copy.test.js`
- **Depends on:** U11
- **Status:** todo
- **Tests:**
  - happy: el paso en es y en → tiene los tres riesgos, con la misma cantidad de filas.

### U17. Jev revisa a un LLM
- **Goal:** un paso de práctica sí/no donde el texto es una política y la respuesta de un chatbot, y Jev dice si la respuesta afirma algo que la política no dice; un segundo ejemplo con instrucciones metidas en el texto entra solo si una corrida real muestra que mueve la respuesta.
- **Covers:** R18 · F3
- **Files:** `copy.js`, `tests/copy.test.js`, `scripts/demo-check.mjs`
- **Depends on:** U11
- **Status:** todo
- **Tests:**
  - happy: el ejemplo con un dato inventado → Jev dice que sí con 0,9 o más, verificado por `demo-check`.
  - edge: el ejemplo de inyección → se mide 3 veces antes de sumarlo; si no mueve la respuesta, no entra.

### U18. Errores del gateway en lenguaje llano
- **Goal:** si el gateway responde error de key o de saldo, la vista muestra "Jev no respondió: la key no es válida o no hay saldo" con qué hacer, en vez del mensaje crudo en inglés.
- **Covers:** R10 · F5
- **Files:** `index.html`, `copy.js`, `tests/copy.test.js`
- **Depends on:** U11
- **Status:** todo
- **Tests:**
  - error: una key inválida → el mensaje en el idioma de la UI, sin el texto crudo del gateway.

### U19. CI and uptime
- **Goal:** cada push corre `npm test` en GitHub Actions. Uptime no aplica: no hay superficie pública (la charla corre en local y R9 está en cut).
- **Covers:** —
- **Files:** `.github/workflows/ci.yml`
- **Depends on:** —
- **Status:** todo
- **Tests:**
  - happy: push a main → CI en verde.
  - error: un test roto → CI en rojo.

### U20. Guion del presentador por paso
- **Goal:** `docs/GUION.md` dice, para cada paso de la lección, qué decir en una o dos frases, qué mostrar o tocar en pantalla, el tiempo (los 7 pasos en vivo suman 15 minutos) y la transición al siguiente; los pasos que no van en vivo llevan una línea para el video o para después.
- **Covers:** R20 · F5
- **Files:** `docs/GUION.md`
- **Depends on:** U12, U14, U16, U17
- **Status:** todo
- **Tests:**
  - happy: el guion → tiene una entrada por cada paso de `copy.js`, en el mismo orden, y los tiempos de los pasos en vivo suman 15 minutos. Covers AE13.
  - edge: cada cifra que menciona → sale de `demo-check` o de la respuesta del gateway.

### U21. Tokens en index.html
- **Goal:** `index.html` usa los tokens de `docs/DESIGN.md` en lugar de literales: los colores del bloque de código (`--code-bg`, `--code-fg`), los radios (`--radius-sm`, `--radius-md`, `--radius-pill`) y los tamaños (`--fs-*`), sin cambio visible.
- **Covers:** R11 · F5
- **Files:** `index.html`
- **Depends on:** —
- **Status:** todo
- **Tests:**
  - happy: los colores con `#` aparecen solo dentro de `:root`, y las capturas de un paso de teoría y uno de práctica coinciden con las de antes.

## Cut line
| Tier | Units | Why |
|---|---|---|
| must | U1, U11, U12, U13, U14, U15, U16, U9, U19, U20 | la lección en vivo, lo que dice de la confianza y el código vigente son la charla; el deck y el guion la sostienen; el video ocupa 6 de los 25 minutos; CI avisa si algo se rompe antes del viernes |
| should | U17, U18, U6, U21 | suman un caso fuerte para la consigna, un error legible si falla el gateway y legibilidad en la sala, pero la charla anda sin ellos |
| cut | U2, U3, U4, U5 | construidos y retirados el 2026-10-12 al pasar a la lección guiada; R1–R5 quedan para después |
| cut | U7 | el presentador eligió no deployar; R9 queda sin cubrir y AE6 no se ejecuta |
| cut | U8, U10 | U8 es el deck del desafío, reemplazado por U13; U10 queda absorbida por U15 |

## Risks
- La red de la sala no llega al gateway — likelihood: media — mitigation: probar la red el día anterior desde la sala — fallback: mostrar el video (U9) y las cifras de `challenge/results.json`.
- Rate limit o error del gateway con 15 llamadas seguidas — likelihood: baja (medido: 0 errores con concurrencia 15 y 5) — mitigation: concurrencia 5 y reintento por fila — fallback: las filas fallidas muestran "Reintentar" y el marcador cuenta sobre las que respondieron.
- ~~Jev acierta la trampa de conteo y no se ve la falla~~ — ocurrió en U2 (15/15). Resuelto: R3 muestra el dato medido; las fallas reales del set (área y urgencia) y la confianza baja cargan el mensaje de "no confíes ciegamente".
- `experimental_evaluate` cambia en una versión nueva de `ai` — likelihood: baja — mitigation: pinnear `ai` a la versión exacta instalada (regla común de dependencias) en U1.
- El costo real es mayor que el estimado si AI Gateway cobra tokens de salida — likelihood: media — mitigation: rotular el costo como estimado de entrada y contrastarlo con el consumo del dashboard de AI Gateway después de una corrida — fallback: decir en la charla que es una cota inferior.
- Los tokens y el costo cambian entre corridas — likelihood: alta — mitigation: el deck y el video toman las cifras del JSON de una corrida y lo dicen; en vivo se muestran las de esa corrida.

- `jev-latest` cambia de versión y el caso dudoso del paso 7 pasa el umbral — likelihood: media — mitigation: `demo-check` antes de cada ensayo y el viernes a las 11:00 — fallback: fijar `typesafe-ai/jev-1.14.0` o cambiar el texto y volver a medir.
- El video no llega a tiempo (HeyGen, tomas, armado) — likelihood: media — mitigation: U9 arranca apenas estén U12 y U14 — fallback: estirar la lección en vivo a 21 minutos y dejar el video para después.

## Out of scope
- Que cada asistente juegue el desafío en su navegador; ranking entre asistentes (BRIEF, Para después).
- Integrar Jev en código propio en vivo; datos reales del equipo; keys individuales; comparación en vivo contra un LLM (BRIEF, Fuera de este producto).
- Cargar un set de tickets propio o subir un CSV; varias preguntas a la vez en el desafío (`docs/UX.md`, Out of scope).
- Deploy de la demo (U7, cut).
