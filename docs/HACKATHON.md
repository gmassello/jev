# Brief del evento

Fuente: respuestas del presentador del 2026-10-10, 2026-10-19 y 2026-10-24. Es una charla interna sin página pública, así que todos los valores salen de esas respuestas; lo que no se especificó figura como `not published`.

## Evento

- **Nombre:** Evaluar con Jev: de una pregunta cerrada a una decisión con probabilidad (charla interna)
- **URL:** not published (interna)
- **Organizador:** gmassello
- **Público:** compañeros de trabajo, todos programadores
- **Sponsors:** not published
- **Tema:** qué es Jev (`typesafe-ai/jev`) y cómo usarlo

## Timeline

| Etapa | Zona del evento | Local (-03:00) |
|---|---|---|
| Presentación (deadline) | 2026-10-30 12:00 -03:00 | 2026-10-30 12:00 -03:00 |
| Entregables listos | not published (se asume antes de la presentación) | not published |
| Feedback / seguimiento | not published | not published |

Se movió del 2026-10-22 15:00 por pedido del presentador (2026-10-19).

La zona del evento es la hora argentina (ART, -03:00), la misma que la local del presentador.

## Premios y tracks

not published (charla interna, sin premios ni tracks).

## Criterios de juicio

No hay jurado. Son los criterios de éxito del presentador, que el resto del flujo usa como criterios de juicio.

| Criterio | Peso | Regla (palabras del presentador) |
|---|---|---|
| Entienden qué es Jev y qué no | not published | "Entienden qué es y qué no": distinguen Jev de un LLM y saben cuándo usar cada uno |
| Pueden integrarlo solos | not published | "Pueden integrarlo solos": después de la sesión, alguien lo llama desde su código sin ayuda |
| Detectan un caso propio | not published | "Detectan un caso propio": sale al menos un caso de uso real del equipo para pilotear |
| Costo y riesgos claros | not published | "Costo y riesgos claros": entienden el costo, la calibración y la seguridad de la key |

## Tecnología obligatoria

- **Jev en Vercel AI Gateway** (`typesafe-ai/jev`) con `experimental_evaluate` del AI SDK (`ai` v7).
- **Cómo se demuestra:** llamados en vivo desde el playground durante la demo (`POST /evaluate`) y el snippet del paso 11, «Llevalo a tu código», del playground.

## Requisitos de entrega

| Entregable | Formato | Límites |
|---|---|---|
| Formato de la sesión | Lección en vivo + demo grabada + preguntas | 25 minutos: 15 de lección, 6 de demo grabada y 4 de preguntas |
| Deck | HTML + PDF | Cantidad de slides / duración: not published |
| Demo | Playground en local (`PORT=3001 npm start`); el deploy quedó en cut (PLAN U7) | Respaldo: el video corto |
| Video corto | Demo grabada, narrada por un avatar con la voz clonada del presentador (HeyGen); se proyecta en la charla y queda para quien no estuvo | Hasta 6 minutos; formato: not published |
| Ejercicio guiado | Un caso real del equipo resuelto con Jev (por ejemplo, clasificar tickets o logs) | not published |

## Descalificadores

not published (charla interna, sin reglas).

Restricciones propias que ya están documentadas en el repo (README, «Before you use it in production»), no reglas del evento:

- La API key nunca llega al navegador ni al repo.
- Un endpoint público que reenvía a Jev tiene que estar protegido (auth, rate limit, límite de gasto).
- El `state` puede llevar PII: se trata como cualquier request a un proveedor externo.

## Bloqueantes

Prerrequisitos que dependen del presentador:

- **Slot de calendario, sala o link de la reunión** para la charla.
- **Acceso a la API para los asistentes**: una demo compartida protegida, o una key de AI Gateway por persona (cuenta de Vercel con tarjeta cargada).
- **Aprobación de la empresa para mandar datos internos a un proveedor externo**: necesaria antes de usar un caso real del equipo (tickets, logs) en el ejercicio guiado.
