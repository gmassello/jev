# Caso chico — un ticket, dos preguntas

Caso propio y trivial: un solo ticket de soporte recorre todo el sistema una vez (navegador → `server.js` → AI SDK → AI Gateway → Jev → respuesta). Si falla, falla el contrato o la conexión, no el problema.

## Actores
- A1. Presentador — corre el playground en local y hace la llamada.

## Requerimientos
- R1. El playground sirve su página en la URL base.
- R2. Una pregunta `boolean` sobre el ticket devuelve una probabilidad entre 0 y 1.
- R3. Una pregunta `choice` devuelve una de las opciones dadas y su distribución.
- R4. Cada respuesta informa tokens, tiempo y modelo.
- R5. Un request inválido o una ruta inexistente devuelven un error legible, sin tirar el server.
- R6. Cada respuesta trae la confianza de TypeSafe por pregunta y el costo de la llamada en US$ (BRIEF R16; `docs/ARCHITECTURE.md` § Contracts).

## Datos
- **Ticket:** "Hola, me cobraron dos veces la suscripción de octubre. Quiero que me devuelvan uno de los cargos."
- **Pregunta `refund`** (`boolean`): "¿El cliente pide un reembolso?" → esperado: sí (probabilidad ≥ 0.5).
- **Pregunta `team`** (`choice`): "¿A qué área va este ticket?" con `facturacion`, `envios`, `tecnica`, `cuenta` → esperado: `facturacion`.

## Ejemplos de aceptación
- AE1. **Covers R1.** Given el server corriendo, when se pide `GET /`, then responde 200 con un HTML que contiene `<title>Jev Playground</title>`.
- AE2. **Covers R2.** Given el ticket, when se evalúa `refund`, then `answers.refund.probability` está en [0, 1] y es ≥ 0.5.
- AE3. **Covers R3.** Given el ticket, when se evalúa `team`, then `answers.team.choice` es `facturacion`, las keys de `probabilities` son las cuatro opciones y suman 1 (±0.02).
- AE4. **Covers R4.** Given cualquier evaluación exitosa, then `usage.inputTokens` y `usage.outputTokens` son enteros > 0, `usage.totalTokens` es su suma, `ms` es un número > 0, `modelId` es `typesafe-ai/jev` y `warnings` es una lista.
- AE6. **Covers R6.** Given cualquier evaluación exitosa, then `confidence` es un objeto con una entrada por id de pregunta, cada una un número en [0, 1], y `cost` es un número ≥ 0.
- AE5. **Covers R5.** Given un body que no es JSON, when se hace `POST /evaluate`, then responde 500 con `{ "error": "<texto no vacío>" }`; given una ruta inexistente, then responde 404 con `{ "error": "not found" }`.

## Contrato de runtime
- **URL base:** la del server (`npm start` usa el puerto 3000; la charla, `PORT=3001`).
- **Health / reset:** no hay; el server no tiene estado.
- **Acceso:** con `ACCESS_PASSWORD` en el server, todo pide basic auth y sin la clave responde 401; los checks la mandan si existe `JEV_ACCESS_PASSWORD`.
- **`POST /evaluate`:** body `{ "state": string | object, "questions": { "<id>": Question } }` → 200 `{ answers, usage, warnings, modelId, ms, confidence, cost }`.
- **Forma del error:** `{ "error": "<mensaje>" }` con 500 (falla de la evaluación o body inválido) o 404 (ruta inexistente).
- **Requiere:** `AI_GATEWAY_API_KEY` en el entorno del server. Cada corrida de los checks hace 3 llamadas reales a Jev.
