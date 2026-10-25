Source: docs/BRIEF.md · prioridades de la Cut line de docs/PLAN.md (revisado el 2026-10-24)

# Evaluar con Jev — Casos de uso

El sistema es el playground local (`index.html` + `copy.js` + `server.js` → AI SDK → AI Gateway → Jev) y los artefactos de la charla del 2026-10-30 (guion, deck y video). Lo prueba la sesión: un video de unos 20 minutos y después preguntas en vivo; no hay suite del evento. Los encabezados `##` quedan en inglés porque los leen los scripts del flujo.

## Features

| IDs | Funcionalidad | Actor | Prioridad (PLAN) | Criterio | ¿Se ve en el video? |
|---|---|---|---|---|---|
| R11, R12, R13, R14, R19 · F5 | Lección guiada de 16 pasos: práctica con llamadas reales, caso que duda, cuándo usarlo, Jev revisa a un LLM, los dos casos del equipo, parecidos, glosario, arquitectura y producción | A1, A2 | must (U11, done) | Entienden qué es Jev y qué no; Costo y riesgos claros; Pueden integrarlo solos | Sí: es el recorrido |
| R11 · F5 | Saltar a un paso para grabar cada toma del video | A1 | must (U12, done) | Entienden qué es Jev y qué no | No |
| R11 · F5 | Casos del equipo: por qué falló una suite y qué tan grave es un defecto | A1, A2 | must (U22, done) | Detectan un caso propio | Sí: "dónde usarlo" |
| R16 · F5 | Probabilidad por opción, confianza de TypeSafe y costo de la llamada | A1, A2 | must (U14, done) | Costo y riesgos claros | Sí: el paso que duda |
| R6, R15 · F3 | Snippet con la API vigente del AI SDK | A2 | must (U15, done) | Pueden integrarlo solos | Sí: el cierre |
| R17 · F5 | Riesgos para producción en "Cuándo usar Jev" | A1, A2 | must (U16, done) | Costo y riesgos claros | Sí |
| R7, R8 · F3 | Deck con el título de la charla, impacto, dónde usarlo y consigna de caso propio | A1, A2 | must (U13, U23, done) | Entienden qué es Jev y qué no; Detectan un caso propio; Costo y riesgos claros | Sí: las slides de impacto, riesgos, casos y consigna |
| R10 · F5 | La charla entera en video, de hasta 21 minutos, con el avatar | A2, A3 | must (U9) | Pueden integrarlo solos | Es el video |
| R18 · F3 | Jev revisa la respuesta de un chatbot | A1, A2 | should (U17, done) | Detectan un caso propio | Sí: "dónde usarlo" |
| R10 · F5 | Errores del gateway en lenguaje llano | A1 | should (U18, done) | — (respaldo al grabar y al probar después) | No |
| R20 · F5 | Guion completo del video en español | A1 | must (U20, U24, done) | Entienden qué es Jev y qué no | Es la narración |
| R1, R2, R3, R4, R5, R9 | Desafío con marcador y demo deployada | — | cut (U2–U5 retirados, U7) | — | No |



## Happy paths

### F5. Sesión de unos 20 minutos + preguntas — R11, R12, R16, R17, R19, R20

Estado inicial para grabar: `PORT=3001 npm start` con `AI_GATEWAY_API_KEY` cargada, el navegador en el paso 1 y la interfaz en español; `node scripts/demo-check.mjs --check` en verde. El orden de las tomas está en `docs/GUION.md` y la narración en `video/script.tsv`.

1. Apertura con el avatar: tres partes y el aviso de que es un avatar.
2. Qué es: pasos 1, 2 ("¿Se le devolvió la plata al cliente?" → sí, cerca de 1), 3 (estafa), 5 (el ticket de la contraseña va a `cuenta`), 6 (reembolso, área y urgencia en una llamada) y 7 ("La app me tiró error al pagar…" → `facturacion` debajo de 0,9 y el aviso de revisión humana).
3. Paso 8, "Cuándo usar Jev y cuándo no".
4. Impacto: slides antes y después, costo cada 1000 tickets y riesgos.
5. Dónde usarlo: repaso del paso 5, paso 9 (el bot que inventa), paso 10 (la suite que falló por el ambiente), paso 11 (el defecto crítico) y la slide de los cuatro casos.
6. Paso 16, "Llevalo a tu código", con el snippet listo para copiar.
7. Consigna y cierre; después, preguntas en vivo.

Criterios de aceptación:
- AE7. Given un paso de práctica, when el presentador aprieta "Preguntar a Jev", then se ven la respuesta, la probabilidad de cada opción y la explicación de cómo leerla. — **How it is proven:** `node scripts/demo-check.mjs --check` (respuestas de los pasos 2 a 7) + `screenshot` de un paso de práctica.
- AE8. Given el paso "Cuando Jev duda", when se pregunta, then la respuesta queda por debajo de 0,9 y aparece el aviso de revisión humana. — **How it is proven:** `node scripts/demo-check.mjs --check` (una corrida) + `python3 cases/medium/checks.py http://localhost:3001` (`check_doubt_stable`, tres corridas) + `screenshot` del aviso.
- AE11. Given la respuesta del paso "Cuando Jev duda", then la probabilidad de cada opción y la confianza se muestran como valores distintos. — **How it is proven:** `python3 cases/small/checks.py http://localhost:3001` (`check_confidence_and_cost`) + `screenshot` del paso 7.
- AE12. Given los pasos de arquitectura y de producción, then se ven el recorrido navegador → server → AI Gateway → Jev, las tres opciones para llamar a Jev, la compuerta de decisión y la checklist con la versión fija del modelo. — **How it is proven:** `npm test` (test de forma de `arch` y `prod`) + `screenshot` de los dos pasos.
- AE10. Given el video final, then dura 21 minutos o menos. — **How it is proven:** `python3 cases/large/checks.py .` (`check_video`, falla hasta U9).
- AE13. Given el guion, then la columna hablada de `video/script.tsv` suma entre 2.700 y 3.100 palabras, y `docs/GUION.md` tiene una entrada por cada paso de la lección, en el mismo orden, que dice en qué bloque del video aparece o que queda fuera. — **How it is proven:** `python3 cases/large/checks.py .` (`check_script` y `check_guion`).

### F3. De la charla al código — R6, R7, R15, R18

Estado inicial: el navegador en el paso 16, con la key en el entorno de quien copia el snippet.

1. El asistente copia el snippet con el botón Copiar y lo guarda como `jev.mjs`.
2. Corre `npm i ai@<versión del paso>` y `node jev.mjs`.
3. La consola imprime la decisión de ruteo.
4. (should, U17) El presentador muestra a Jev revisando la respuesta de un chatbot contra una política.
5. La consigna pide nombrar un caso propio.

Criterios de aceptación:
- AE9. Given el snippet copiado del último paso (hoy, el 14) y la key en el entorno, when se corre con node, then imprime "Rutear a cuenta". — **How it is proven:** `node jev.mjs` con el snippet copiado (verificado el 2026-10-24 con `experimental_decide` y `ai@7.0.153`; sin la key falla con `GatewayAuthenticationError`) + `python3 cases/large/checks.py .` (`check_snippet_current_api`).
- proposed: Given una política de devoluciones de 30 días, then Jev marca la respuesta "90 días" como inventada (≥ 0,9) y la de "30 días" como fiel (≤ 0,1). — **How it is proven:** `python3 cases/medium/checks.py http://localhost:3001` (`check_guardrail_pair`). Sin ID: se puede sumar al BRIEF con `hackathon-brainstorm --revisar`.

## Test cases

### Small — un ticket, dos preguntas
`cases/small/` · dominio: un ticket de facturación · PLAN: corre sobre lo que existe; U14 completa la última fila.

| Layer | Criterion | How it is proven |
|---|---|---|
| Producto | La página sirve el playground | `check_page_serves_playground` |
| Producto | `boolean` "¿El cliente pide un reembolso?" da probabilidad en [0, 1] y ≥ 0,5 | `check_refund_boolean` |
| Producto | `choice` de área da `facturacion` con las 4 opciones, que suman 1 | `check_team_choice` |
| Sistema | Tokens, tiempo, modelo y warnings en cada respuesta; totalTokens = entrada + salida | `check_usage_and_timing` |
| Sistema | Confianza de TypeSafe por pregunta en [0, 1] y costo de la llamada ≥ 0 | `check_confidence_and_cost` |
| Sistema | Body inválido → 500 con error legible; ruta inexistente → 404 | `check_invalid_json`, `check_unknown_route` |

Correr: `python3 cases/small/checks.py http://localhost:3001` (4 llamadas reales). Hoy: 7/7.

### Medium — 5 tickets en tanda y los riesgos de la lección
`cases/medium/` · dominio: tickets de soporte, un mail y una política de devoluciones · PLAN: U14, U15; corrido después de U15 (7/7, 2026-10-24); se vuelve a correr el viernes antes de la charla.

| Layer | Criterion | How it is proven |
|---|---|---|
| Producto | Jev acierta el área de al menos 4 de 5 tickets | `check_accuracy` |
| Producto | El ticket ambiguo queda debajo de 0,9 en las 3 corridas | `check_doubt_stable` |
| Producto | El mail da `Estafa` con las opciones en dos órdenes | `check_order_independent` |
| Producto | La respuesta inventada da sí ≥ 0,9 y la fiel da sí ≤ 0,1 | `check_guardrail_pair` |
| Sistema | Las 5 llamadas con concurrencia 5 responden 200 con `choice` y las 4 probabilidades | `check_batch_all_answered` |
| Sistema | La tanda tarda menos de 10 s y su costo estimado de entrada es menor a US$0,001 | `check_batch_fast_and_cheap` |
| Sistema | La suma del costo que informa el gateway para la tanda es menor a US$0,001 | `check_talk_cost` |

Correr: `python3 cases/medium/checks.py http://localhost:3001` (12 llamadas reales). Hoy: 7/7.

### Large — la charla completa
`cases/large/` · dominio: los artefactos de la charla · PLAN: U11, U15, U20, U13, U22, U23, U24, U9.

| Layer | Criterion | How it is proven |
|---|---|---|
| Producto | 16 pasos con los mismos ids en es y en, incluidos los 11 del video | `check_lesson_steps` |
| Producto | El snippet usa `experimental_decide` y no `experimental_evaluate` | `check_snippet_current_api` |
| Producto | El guion ubica cada paso en un bloque del video o fuera de él | `check_guion` |
| Producto | La narración suma entre 2.700 y 3.100 palabras (~20 min) | `check_script` |
| Producto | El deck lleva el título de la charla y existe en PDF | `check_deck` |
| Sistema | El video existe y dura 1260 s o menos | `check_video` (falla hasta U9) |

Correr: `python3 cases/large/checks.py .` (sin red; necesita `node` y `ffprobe`). Hoy: 5/6.

### Validación de las suites (2026-10-24)
- **Contra algo que funciona:** un server mínimo escrito desde los SPEC (fuera del repo) da 7/7 en el chico y 7/7 en el mediano; un repo armado desde `cases/large/SPEC.md` da 5/5.
- **Contra algo roto:**
  - una confianza de 1,4 o un costo negativo rompen `check_confidence_and_cost`;
  - un costo negativo rompe `check_talk_cost`;
  - elegir siempre la primera opción rompe `check_order_independent` y `check_accuracy`;
  - decir siempre sí rompe `check_guardrail_pair`;
  - `experimental_evaluate` en el snippet rompe `check_snippet_current_api`;
  - un video de 400 s rompe `check_video`.
- **Uso:** puerto muerto → exit 1 sin traceback; sin argumentos → exit 2, en los tres casos.

## Out of scope

- R1, R2, R3, R4, R5 con AE1, AE2, AE3, AE4, AE5 — el desafío con marcador y umbral deslizable se construyó y se retiró el 2026-10-12; queda para después (BRIEF).
- R9 con AE6 — la demo deployada y protegida queda para después: la charla corre en local (PLAN U7, cut).
- Que cada asistente juegue en su propio navegador; integrar Jev en código propio en vivo; datos reales del equipo; comparación en vivo contra un LLM (BRIEF).
- Probar la UI con un navegador automatizado: lo visual queda como `screenshot` y la lógica, en `npm test` y en los checks contra `/evaluate`.
