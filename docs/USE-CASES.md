Source: docs/BRIEF.md · prioridades de la Cut line de docs/PLAN.md

# Jev para devs — Casos de uso

El sistema es el playground local (`index.html` + `server.js` → AI SDK → AI Gateway → Jev) más los artefactos de la charla (deck, video, resultados del desafío). Lo prueba oficialmente la demo en vivo del 2026-10-22; no hay suite del evento. Los encabezados `##` quedan en inglés porque los leen los scripts del flujo.

## Features

| IDs | Funcionalidad | Actor | Prioridad | Criterio | ¿Se ve en el video? |
|---|---|---|---|---|---|
| R1, R2, R3 · F1 | Desafío con 15 tickets de soporte, marcador y pregunta de conteo | A1, A2 | must (U2, U3) | Entienden qué es Jev y qué no | Sí: es el centro |
| R4 · F2 | Umbral de confianza recalculado sin llamar a Jev | A1, A2 | must (U4) | Costo y riesgos claros | Sí: es el final |
| R5 · F2 | Costo y tiempo de cada corrida | A1, A2 | must (U5) | Costo y riesgos claros | Sí: pie de la corrida |
| R6, R7 · F3 | Camino a integrar (snippet, Docs, slide) y consigna de caso propio | A2 | must (U8; U10 should) | Pueden integrarlo solos; Detectan un caso propio | Parcial: cierre del video |
| R8 | Deck en español (HTML + PDF) | A1, A2 | must (U8) | Entienden qué es Jev y qué no | No: soporte de la charla |
| R10 · F4 | Video corto en español | A3 | must (U9) | Pueden integrarlo solos | Es el video |
| R9 · F4 | Demo deployada y protegida | A3 | cut (U7) | Costo y riesgos claros | No |

Sin diferencias con la Cut line del PLAN. Fuera del BRIEF, el código ya tiene el Playground libre y la pestaña Docs: los cubren R6 (Docs) y el soporte del desafío, así que no hace falta un R nuevo.

## Happy paths

### F1. Desafío en vivo — R1, R2, R3

Estado inicial: playground corriendo en local (`PORT=3001 npm start`) con `AI_GATEWAY_API_KEY` cargada, pestaña Desafío abierta y el set "Tickets de soporte" precargado.

1. Se ve la tabla con los 15 tickets y la columna *Esperado*; la pregunta precargada es "¿A qué área va este ticket?" (Facturación / Envíos / Técnica / Cuenta).
2. El público dicta "¿Pide un reembolso?" y el presentador la elige de las preguntas sugeridas.
3. Clic en **Evaluar los 15 tickets**: "Evaluando 6/15…" y las filas se completan.
4. El marcador muestra N/15 y resalta las filas falladas con respuesta de Jev, esperada y confianza.
5. El presentador elige "¿Cuántos productos distintos menciona?" y la evalúa: el marcador muestra lo que midió frente a la limitación que declara la doc.

Criterios de aceptación:
- AE1. Given el desafío abierto, when el presentador elige el set de tickets de soporte, then se ven los tickets en español con su respuesta esperada. — **How it is proven:** `node --test tests/tickets.test.js` (forma del set, PLAN U2) + `screenshot` de la pestaña.
- AE2. Given una pregunta cargada, when se evalúa el set, then el marcador muestra cuántos acertó sobre el total y marca cada caso fallado con la respuesta de Jev, la esperada y su confianza. — **How it is proven:** `node --test tests/score.test.js` (PLAN U3) + `python3 cases/large/checks.py .` (`check_runs_consistent`).
- AE3. Given el set completo, when se evalúa la pregunta de conteo, then el marcador muestra el resultado medido de esa corrida (aciertos y confianza por ticket) junto a la limitación que declara la doc, sin forzar una falla. — **How it is proven:** `npm run challenge` escribe `challenge/results.json`; `node --test --test-name-pattern="trap"` y `python3 cases/large/checks.py .` (`check_trap_recorded`) verifican que la corrida quede registrada.

### F2. Calibrar el umbral — R4, R5

Estado inicial: el marcador de F1 cargado con la pregunta de área.

1. El slider arranca en 0.5: se ven Automáticos, A revisión humana y Errores que se automatizarían.
2. El presentador lo lleva a 0.9: bajan los automáticos, suben los de revisión y los números cambian al instante.
3. El pie muestra 15 tickets, segundos, tokens y costo estimado (entrada) en US$.

Criterios de aceptación:
- AE4. Given un marcador cargado, when el umbral pasa de 0.5 a 0.9, then baja la cantidad de casos automatizados, sube la de revisión humana, y los números cambian sin volver a llamar a Jev. — **How it is proven:** `node --test tests/score.test.js` (PLAN U4: función pura, sin red) + `screenshot` antes/después.
- AE5. Given una corrida terminada, then se muestran los tokens usados, el costo estimado en dólares y el tiempo total. — **How it is proven:** `node --test tests/pricing.test.js` (PLAN U1/U5) + `python3 cases/large/checks.py .` (`check_runs_measured`) + `python3 cases/medium/checks.py http://localhost:3001` (`check_batch_fast_and_cheap`).

### F3. De la charla al código — R6, R7

Estado inicial: el deck en la slide de integración.

1. La slide muestra el snippet de `experimental_evaluate`, el mismo que la pestaña Docs › Integración.
2. El presentador abre Docs desde "Así se hace en código →".
3. La última slide antes del cierre pide: "Nombrá un caso de tu trabajo donde usarías Jev".

Criterios de aceptación:
- proposed: Given el snippet de Docs, when se corre tal cual con la key, then imprime una probabilidad entre 0 y 1. — **How it is proven:** `node --test tests/snippet.test.js` (PLAN U10). Sin ID: se puede sumar al BRIEF con `hackathon-brainstorm --revisar`.
- proposed: Given el deck, then la consigna de caso propio es la última slide antes del cierre. — **How it is proven:** `screenshot` del deck (PLAN U8).

### F4. Asíncrono — R10

Estado inicial: alguien que no fue a la charla, sin nada instalado.

1. Abre el video corto en español.
2. Ve el desafío completo: pregunta, marcador, resultado de la pregunta de conteo, umbral y costo.
3. El cierre le dice dónde está el snippet y el repo.

Criterios de aceptación:
- proposed: Given el video, then muestra el marcador asentado con una cifra que coincide con `challenge/results.json`. — **How it is proven:** `python3 cases/large/checks.py .` (`check_video`) + `screenshot` del fotograma del marcador.
- AE6 (R9, demo protegida) no aplica: U7 está en cut.

## Test cases

### Small — un ticket, dos preguntas
`cases/small/` · dominio: un ticket de facturación · PLAN: corre sobre lo que ya existe; lo reafirman U1 y U5.

| Layer | Criterion | How it is proven |
|---|---|---|
| Producto | La página sirve el playground | `check_page_serves_playground` |
| Producto | `boolean` "¿Pide un reembolso?" da probabilidad en [0, 1] y ≥ 0.5 | `check_refund_boolean` |
| Producto | `choice` de área da `facturacion` con las 4 opciones y suma 1 | `check_team_choice` |
| Sistema | Tokens, tiempo, modelo y warnings en cada respuesta; totalTokens = entrada + salida | `check_usage_and_timing` |
| Sistema | Body inválido → 500 con error legible; ruta inexistente → 404 | `check_invalid_json`, `check_unknown_route` |

Correr: `python3 cases/small/checks.py http://localhost:3001` (3 llamadas reales a Jev).

### Medium — 5 tickets en tanda
`cases/medium/` · dominio: los cuatro tipos de ticket · PLAN: U2, U3. Se vuelve a correr al cierre como evidencia de que nada se ajustó a mano para el grande.

| Layer | Criterion | How it is proven |
|---|---|---|
| Producto | Jev acierta el área de al menos 4 de 5 tickets | `check_accuracy` |
| Sistema | Las 5 llamadas con concurrencia 5 responden 200, con `choice` y las 4 probabilidades | `check_batch_all_answered` |
| Sistema | La tanda tarda menos de 10 s y cuesta menos de US$0.001 estimado de entrada | `check_batch_fast_and_cheap` |

Correr: `python3 cases/medium/checks.py http://localhost:3001` (5 llamadas reales).

### Large — la charla completa
`cases/large/` · dominio: los 15 tickets del desafío más deck y video · PLAN: U2, U3, U4, U5, U8, U9.

| Layer | Criterion | How it is proven |
|---|---|---|
| Producto | Cada corrida del desafío tiene 15 filas y `correct` coincide con las filas acertadas | `check_runs_consistent` |
| Producto | La corrida de conteo (`trap`) está registrada con sus 15 filas medidas | `check_trap_recorded` |
| Producto | El deck existe en PDF 16:9, en español, y muestra un marcador medido | `check_deck` |
| Producto | Hay video `.mp4` no vacío | `check_video` |
| Sistema | Cada corrida registra tokens y tiempo | `check_runs_measured` |

Correr: `python3 cases/large/checks.py .` (sin red; lee artefactos). Desde U2 pasa 3/5: `challenge/results.json` ya existe y es consistente; fallan `check_deck` y `check_video` hasta U8 y U9.

### Validación de las suites
- **Contra algo que funciona:** un server mínimo escrito desde las specs (fuera del repo) da 6/6 en el chico y 3/3 en el mediano; un repo armado desde `cases/large/SPEC.md` da 5/5 en el grande. El playground real da 6/6 y 3/3 (2026-10-10).
- **Contra algo roto:** responder 200 a un body inválido rompe `check_invalid_json`; un `totalTokens` mal sumado rompe `check_usage_and_timing`; etiquetar todo como `envios` rompe `check_accuracy` (1/5); un `correct` que no coincide con las filas rompe `check_runs_consistent` y `check_deck`.
- **Uso:** puerto muerto → exit 1 sin traceback; sin argumentos → exit 2.

## Out of scope

- R9 / AE6, demo deployada y protegida: U7 está en cut por decisión del presentador.
- Que cada asistente juegue en su navegador; ranking entre asistentes; set de tickets propio o CSV; varias preguntas a la vez en el desafío (BRIEF y `docs/UX.md`).
- Probar la UI del desafío con un navegador automatizado: lo visual queda como `screenshot` y la lógica, en tests de funciones puras (`tests/score.test.js`).
