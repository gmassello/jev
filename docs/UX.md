# Jev para devs — UX

## Review 2026-10-10

Modo Mejora: el repo ya tiene UI (`index.html`). Se audita contra `docs/BRIEF.md` y los criterios de `docs/judging.tsv`, pensando en una charla proyectada donde el presentador maneja la pantalla (A1) y el público dicta (A2).

### Current flow

1. Abre en la pestaña **Playground** (`index.html:92`, `index.html:784`), con el ejemplo Soporte precargado.
2. **Situación**: chips de ejemplo (Soporte, Reseña, Email) y textarea (`index.html:100`).
3. **Preguntas**: tarjetas con tipo Sí/No, Elegir una opción o Puntaje; opciones editables.
4. **Preguntarle a Jev** (`index.html:107`): el botón cambia a "Pensando…" (`index.html:152`) mientras espera.
5. **Resultados** (`index.html:109`): por pregunta, veredicto ("Sí · 98% de seguridad", `index.html:154`) y barras; pie "Respondió en N ms · N tokens" (`index.html:155`).
6. **Modo avanzado**, colapsado al fondo (`index.html:112`): request y respuesta crudos.
7. Pestaña **Docs** (`index.html:120`): referencia técnica en 11 secciones.

Clicks hasta el primer resultado: 1 (el ejemplo ya está cargado). No existe nada del desafío del BRIEF (R1–R5).

### Findings

| # | Hallazgo | Heurística / ley | Evidencia | Propuesta | Impacto (criterio) | Esfuerzo |
|---|---|---|---|---|---|---|
| 1 | No existe el desafío, que es el centro de la charla | Paradox of the Active User, Peak-End | BRIEF R1–R5, F1, F2; ninguna vista en `index.html` | Pestaña **Desafío** con 15 tickets precargados, una pregunta, evaluación del set, marcador y umbral (ver Proposed flow) | Alto: Entienden qué es Jev y qué no; Costo y riesgos claros | L |
| 2 | El costo no aparece en dólares y el JSON queda escondido al fondo | 1 Visibility of system status, 6 Recognition | `index.html:155`, `index.html:112` | Pie con tiempo, tokens y costo estimado en US$; botón "Ver JSON" junto a los resultados que abre request y respuesta ahí mismo | Medio: Costo y riesgos claros; Pueden integrarlo solos | S |
| 3 | "98% de seguridad" choca con "confianza" de Docs y se confunde con security; los resultados no enlazan a la explicación | 4 Consistency, 10 Help | `index.html:154`; Docs › Interpretar resultados | Usar "confianza" en toda la UI ("Sí · 98% de confianza"); link "¿Cómo leer esto?" bajo los resultados que abre Docs en `#doc-results` | Medio: Entienden qué es Jev y qué no | S |
| 4 | Faltan los toggles de tema y registro (regla común) y el texto es chico para proyectar | 8 Aesthetic and minimalist, Fitts | tema solo por `prefers-color-scheme` (`index.html:14`); cuerpo 16 px, código 12 px | Toggle claro/oscuro y técnico/para dummies en el header; botón "Modo proyector" que sube la escala del texto | Bajo–medio: legibilidad en la sala | M |

Contraste, foco y teclado van a `hackathon-ux-ud-review`, no se miden acá.

### Proposed flow

**Navegación.** Tres pestañas, en el orden de la charla: **Desafío** · Playground · Docs. Desafío pasa a ser la pestaña por defecto (es el momento wow); la pestaña elegida se sigue recordando.

**Desafío (F1, F2).** Detalla BRIEF F1 y F2.

1. Al abrir: el set **Tickets de soporte** (15 tickets) ya cargado en una tabla compacta: asunto, primeras palabras y la columna *Esperado*. Arriba, una sola pregunta precargada (`choice`: "¿A qué área va este ticket?" con Facturación / Envíos / Técnica / Cuenta).
2. El público dicta: el presentador edita la pregunta o elige otra del menú de preguntas sugeridas (por ejemplo, "¿Pide un reembolso?" o "¿Cuántos productos menciona?", que es la trampa de conteo). Una pregunta a la vez, para que el marcador hable de una sola cosa.
3. CTA único: **Evaluar los 15 tickets**. Progreso visible "Evaluando 6/15…" y las filas se completan a medida que llegan.
4. **Pico**: el marcador grande "N/15 aciertos" y las filas falladas resaltadas, con la respuesta de Jev, la esperada y la confianza. La trampa de conteo aparece fallada o con confianza baja: ahí se explica qué no es Jev.
5. **Final**: el slider de umbral (0.5 → 0.95). Debajo, tres números que se recalculan sin volver a llamar a Jev: **Automáticos · A revisión humana · Errores que se automatizarían**. El pie cierra con tickets, segundos y costo en US$ de esa corrida (clave `costFooter`), medidos en vivo. Ese es el número que se lleva el público.
6. Link al pie: "Así se hace en código →", que abre Docs en `#doc-integrate` (R6). Después viene la consigna del caso propio (R7), que va en el deck.

**Playground (mejoras 2–3).** El mismo flujo de hoy, con el pie de resultados extendido (tiempo · tokens · costo US$), el botón "Ver JSON" al lado del título de resultados y el link "¿Cómo leer esto?". El veredicto pasa a decir "confianza". El Modo avanzado se va porque lo reemplaza "Ver JSON".

**Header (mejora 4).** Idioma · Tema (claro/oscuro) · Registro (técnico/para dummies) · Modo proyector. El registro arranca en dummies (regla común) y solo cambia la prosa explicativa (intro, ayudas, Docs); los valores medidos, los nombres de campo y el código no cambian.

### States

| Pantalla | Carga (> 400 ms) | Vacío | Error | Éxito |
|---|---|---|---|---|
| Desafío | "Evaluando N/15…" con filas que se van completando | No pasa: el set viene precargado. Si la pregunta queda vacía, el CTA se deshabilita con la ayuda "Escribí una pregunta para evaluar los tickets." | Por fila: "Jev no respondió este ticket. Reintentar." sin perder las demás filas; si falla todo: "No se pudo llegar a Jev. Revisá la conexión o usá la versión local." | Marcador, filas con acierto o fallo, slider y pie de costo |
| Playground | "Pensando…" en el CTA (ya existe) | No pasa: hay un ejemplo precargado | Validación en la tarjeta (ya existe); error del gateway en un recuadro, con la salida en lenguaje humano | Veredictos, barras, pie extendido |
| Docs | N/A (estático) | N/A | N/A | Secciones con índice |

### Copy

Claves nuevas para la tabla de copy (`I18N` en `index.html`), en español y en inglés. Llevan `_tech`/`_plain` solo las que cambian con el registro.

| Clave | Español | Registro |
|---|---|---|
| `tabChallenge` | Desafío | — |
| `challengeIntro_plain` | Jev clasifica 15 tickets de soporte y comparamos con la respuesta correcta. | plain |
| `challengeIntro_tech` | Evaluación de 1 pregunta sobre 15 tickets etiquetados: accuracy, confianza por caso y umbral. | tech |
| `challengeQuestion` | Pregunta para todos los tickets | — |
| `challengeSuggested` | Preguntas sugeridas | — |
| `challengeRun` | Evaluar los 15 tickets | — |
| `challengeProgress` | Evaluando {n}/{total}… | — |
| `challengeScore` | {ok}/{total} aciertos | — |
| `colExpected` | Esperado | — |
| `colJev` | Jev | — |
| `colConfidence` | Confianza | — |
| `thresholdLabel` | Umbral de confianza | — |
| `thresholdAuto` | Automáticos | — |
| `thresholdReview` | A revisión humana | — |
| `thresholdWrongAuto` | Errores que se automatizarían | — |
| `thresholdHelp_plain` | Arriba del umbral, Jev decide solo; abajo, lo mira una persona. | plain |
| `thresholdHelp_tech` | p ≥ umbral → automático; p < umbral → revisión. Medí la precisión por umbral con tu set. | tech |
| `costFooter` | {n} tickets · {s} s · US${usd} | — |
| `toCode` | Así se hace en código → | — |
| `howToRead` | ¿Cómo leer esto? | — |
| `viewJson` | Ver JSON | — |
| `sure` | {p}% de confianza (reemplaza "de seguridad") | — |
| `themeToggle` | Tema | — |
| `registerTech` / `registerPlain` | Técnico / Para dummies | — |
| `projectorMode` | Modo proyector | — |
| `errRowFailed` | Jev no respondió este ticket. Reintentar. | — |
| `errAllFailed` | No se pudo llegar a Jev. Revisá la conexión o usá la versión local. | — |
| `errEmptyQuestion` | Escribí una pregunta para evaluar los tickets. | — |

### Out of scope

- Que cada asistente juegue el desafío en su navegador (BRIEF, Para después).
- Ranking entre asistentes.
- Cargar un set de tickets propio o subir un CSV.
- Varias preguntas a la vez en el desafío: una sola, para que el marcador sea legible.
- Comparación en vivo contra un LLM.
- Contraste, foco y teclado: `hackathon-ux-ud-review`.
