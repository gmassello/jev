# Evaluar con Jev: de una pregunta cerrada a una decisión con probabilidad — Brief

## Resumen
Una charla de 25 minutos para devs: 15 de lección guiada en vivo sobre el playground, con llamadas reales a Jev; 6 de demo grabada y 4 de preguntas. Se van sabiendo qué es Jev, cuándo conviene y cuándo no, cómo leer la probabilidad y la confianza, y cómo llamarlo desde su código.

## Marco del problema
Los compañeros son programadores que no conocen Jev. El riesgo es que lo vean como "otro chatbot" y lo usen donde no corresponde, o que no se animen a meterlo en su código. Una explicación teórica no alcanza: qué significa la confianza, dónde duda y cuánto cuesta se entiende viéndolo responder sobre casos concretos. El repo ya tiene el playground como lección paso a paso, bilingüe, con un paso de código listo para copiar (`index.html`, `copy.js`, `server.js`).

## Discovery
Investigado el 2026-10-24.

- D1. El AI SDK renombró la función: `experimental_evaluate` es un alias `@deprecated` de `experimental_decide` desde `ai@7.0.128` (verificado en el `index.d.ts` de 7.0.128, 7.0.140 y 7.0.153; la 7.0.120 todavía no lo tiene). El playground pinnea 7.0.113 y enseña el nombre viejo. — https://ai-sdk.dev/docs/ai-sdk-core/evaluation
- D2. Para TypeSafe, la confianza no es la probabilidad de la opción elegida: es un número de 0 a 1 que resume la forma de la distribución (1 si todo cae en una opción, 0 si se reparte parejo). Sugiere 0,5 como piso para derivar a una persona, 0,9 para actuar solo en algo riesgoso, y en Noul arrancar con 0,7 para sí y 0,3 para no. — https://docs.typesafe.ai/confidence.md
- D3. Jev 1.14 está disponible desde el 2026-10-14 y es `jev-latest`. Cuesta US$0,042 por millón de tokens de entrada; la salida no se cobra. Contexto de 64k por request y 32k por pregunta (262k con long context); solo texto. — https://docs.typesafe.ai/models.md · https://vercel.com/i/what-is-jev
- D4. TypeSafe publica las debilidades de jev-1.13: lectura literal, números, conteos, fechas, indirección, state grande con ruido, contenido adversario (no trata el state como hostil), criterios contradictorios, sesgo hacia la primera opción y generación de texto. — https://docs.typesafe.ai/model-jaggedness/jev-1.13.md
- D5. Jev también se puede llamar desde Cloudflare Workers AI (`typesafe/jev`, 32k de contexto, sin retención de datos), al mismo precio por token de entrada. — https://developers.cloudflare.com/ai/models/typesafe/jev/
- D6. TypeSafe publica 22 cookbooks de uso: guardrails de LLM, chequeo de citas, clasificación de pasajes de RAG, function calling, re-ranking, entre otros. — https://docs.typesafe.ai/llms.txt

## Impact
- **Persona**: los devs del equipo que van a la charla; sin contactar
- **Pierde hoy**: "no sé si para esto va un LLM o un clasificador, y parsear la respuesta libre de un LLM me rompe el código"
- **La cifra**: sin medir: es una charla interna; al final se cuenta cuántos asistentes nombran un caso propio con la consigna
- **Despues del evento**: pilotear con Jev uno de los casos que nombró el equipo

## Safety
- **Accion irreversible**: sin accion irreversible: la lección solo evalúa texto y muestra la respuesta; no escribe ni dispara nada
- **Quien la autoriza**: no aplica
- **A quien nunca se le aplica**: no aplica
- **Forzado en**: no aplica

## Demo surface
- **Que ejecuta el jurado**: un asistente dicta o escribe su propio texto en un paso de práctica y el presentador aprieta "Preguntar a Jev"
- **Que resultado nuevo sale**: una respuesta de Jev sobre ese texto, con la probabilidad de cada opción y el aviso de revisión humana si no supera el umbral
- **Que apuesta demuestra**: ver dudar al modelo enseña más que verlo acertar: el caso ambiguo bajo el umbral es lo que hace entender para qué sirve la probabilidad
- **Donde**: `PORT=3001 npm start` (local, proyectado en la charla)

## Actores
- A1. Presentador — conduce la lección, corre las preguntas y explica los resultados.
- A2. Asistentes (devs) — dictan textos, interpretan las respuestas y nombran dónde usarían Jev.
- A3. Quien no pudo ir — ve el video y prueba el playground en local siguiendo el README.

## Requerimientos
- R1. **Para después.** Un desafío con un set de tickets de ejemplo con su respuesta esperada. [criterion: Entienden qué es Jev y qué no]
- R2. **Para después.** Un marcador con aciertos, confianza y errores sobre el set. [criterion: Entienden qué es Jev y qué no]
- R3. **Para después.** Una pregunta del set que pone a prueba una limitación documentada (contar), mostrada tal cual se midió. [criterion: Entienden qué es Jev y qué no]
- R4. **Para después.** Un umbral deslizable que reparte el set entre automatizar y revisión humana. [criterion: Costo y riesgos claros]
- R5. **Para después.** Costo y tiempo de cada corrida del desafío. [criterion: Costo y riesgos claros]
- R6. Los asistentes tienen un camino para integrar Jev solos después de la charla: el snippet probado del paso 11 y el README. [criterion: Pueden integrarlo solos]
- R7. La charla cierra con una consigna para que cada asistente nombre un caso de su trabajo donde usaría Jev, apoyada en el caso de guardrail y en los cookbooks de TypeSafe. [criterion: Detectan un caso propio]
- R8. Un deck en español (HTML + PDF), con el título de la charla, acompaña los 15 minutos de lección: qué es Jev, Jev vs. LLMs, probabilidad y confianza, integración, costo y riesgos. [criterion: Entienden qué es Jev y qué no]
- R9. **Para después.** La demo publicada en una URL protegida. [criterion: Costo y riesgos claros]
- R10. Una demo grabada de hasta 6 minutos, en español, narrada por un avatar con la voz clonada del presentador (HeyGen) y declarada como tal; se proyecta en la charla y sirve para quien no estuvo. [criterion: Pueden integrarlo solos]
- R11. La lección en vivo entra en 15 minutos y recorre 7 pasos, cada uno con un tema y un tipo de respuesta: qué es, sí/no, opción con definición, todo junto, cuando Jev duda, cuándo usarlo y código; el resto de los pasos queda en el playground y en el video. [criterion: Entienden qué es Jev y qué no]
- R12. Un caso ambiguo muestra la respuesta por debajo del umbral y la derivación a una persona. [criterion: Costo y riesgos claros]
- R13. Un paso compara cuándo conviene Jev y cuándo otra herramienta, y nombra los proyectos parecidos. [criterion: Entienden qué es Jev y qué no]
- R14. Un glosario repasa los conceptos de la lección. [criterion: Entienden qué es Jev y qué no]
- R15. El snippet de integración usa la API vigente del AI SDK. [criterion: Pueden integrarlo solos]
- R16. La lección distingue la probabilidad de cada opción de la confianza, como la define TypeSafe, y muestra los umbrales que sugiere. [criterion: Costo y riesgos claros]
- R17. "Cuándo usarlo" suma tres riesgos para producción: el texto que entra no es de confianza, Jev prefiere la primera opción, y números, fechas y conteos se resuelven en código. [criterion: Costo y riesgos claros]
- R18. Un caso muestra a Jev como guardrail de un LLM: si la respuesta de un chatbot afirma algo que la política no dice. [criterion: Detectan un caso propio]
- R19. La lección muestra cómo está armado el playground, qué otras formas hay de llamar a Jev y cómo llevarlo a producción con una compuerta de decisión. [criterion: Pueden integrarlo solos]
- R20. El presentador tiene un guion por paso de la lección: qué decir, qué mostrar y cuánto tiempo, con los 7 pasos en vivo sumando 15 minutos. [criterion: Entienden qué es Jev y qué no]

## Flujos principales
- F1. **Para después.** Desafío en vivo con marcador. (A1, A2; R1, R2, R3)
- F2. **Para después.** Calibrar el umbral sobre el set. (A1, A2; R4, R5)
- F3. **De la charla al código** — paso 11 con el snippet → caso de guardrail → consigna de caso propio → cada asistente nombra un caso. (A2; R6, R7, R15, R18)
- F4. **Para después.** Asíncrono sobre la demo deployada. (A3; R9, R10)
- F5. **Charla de 25 minutos** — 15 de lección en vivo por los 7 pasos, preguntando a Jev en los de práctica → 6 de video → 4 de preguntas con la consigna. (A1, A2; R10, R11, R12, R13, R16, R17, R20)

## Ejemplos de aceptación
- AE1. **Covers R1.** Para después.
- AE2. **Covers R2.** Para después.
- AE3. **Covers R3.** Para después.
- AE4. **Covers R4.** Para después.
- AE5. **Covers R5.** Para después.
- AE6. **Covers R9.** Para después.
- AE7. **Covers R11.** Given un paso de práctica, when el presentador aprieta "Preguntar a Jev", then se ven la respuesta, la probabilidad de cada opción y la explicación de cómo leerla.
- AE8. **Covers R12.** Given el paso "Cuando Jev duda", when se pregunta, then la respuesta queda por debajo de 0,9 y aparece el aviso de revisión humana.
- AE9. **Covers R15.** Given el snippet copiado del último paso (hoy, el 13) y la key en el entorno, when se corre con node, then imprime "Rutear a cuenta".
- AE10. **Covers R10.** Given el video final, then dura 6 minutos o menos.
- AE12. **Covers R19.** Given los pasos de arquitectura y de producción, then se ven el recorrido navegador → server → AI Gateway → Jev, las tres opciones para llamar a Jev, la compuerta de decisión y la checklist con la versión fija del modelo.
- AE13. **Covers R20.** Given el guion, then hay una entrada por cada paso de la lección, en el mismo orden, y los tiempos de los 7 pasos en vivo suman 15 minutos.
- AE11. **Covers R16.** Given la respuesta del paso "Cuando Jev duda", then la probabilidad de cada opción y la confianza se muestran como valores distintos.

## Decisiones clave
- Lección guiada paso a paso — chosen over el desafío con marcador because es más simple y pedagógica: un tema y un tipo de respuesta por paso. settled: user-directed
- Charla de 25 minutos: 15 de lección, 6 de demo grabada y 4 de preguntas — chosen over 20 minutos con 10 de lección because la lección necesita aire para el caso que duda y el código. settled: user-directed
- Lección en vivo de 7 pasos — chosen over los 11 pasos because en 15 minutos son unos 2 por paso; el resto queda en el playground y el video. settled: user-directed
- Casos de ejemplo sintéticos — chosen over datos reales del equipo because evita la aprobación para mandar datos internos a un proveedor externo. settled: user-directed
- La charla corre en local — chosen over una demo deployada because no hay que proteger una URL ni exponer la key; el respaldo es el video y el PDF. settled: user-directed
- ~~Desafío con casos etiquetados~~ — reemplazada por la lección guiada (2026-10-12).
- Todo el material de la charla en español — chosen over inglés (regla común de hackathon) because el público habla español; ver `CLAUDE.md`. settled: user-directed

## Scope boundaries
### Para después
- El desafío con marcador y umbral deslizable (R1–R5, F1, F2) — se sacó por complejo para una primera charla.
- La demo deployada (R9, F4) — hace falta protegerla y pagar el gasto de terceros.
- Que cada asistente juegue en su propio navegador durante la charla — necesita keys o una demo compartida.
### Fuera de este producto
- Integrar Jev en código propio en vivo — la charla enseña el patrón; el código de cada equipo es su piloto.
- Datos reales del equipo — necesitan aprobación para salir a un proveedor externo.
- Comparación en vivo contra un LLM — el paso "Cuándo usarlo" lo explica sin gastar tiempo de la charla.

## Supuestos
- La demo corre en local y se proyecta; si falla la red o el gateway, el respaldo es el video y `docs/deck.pdf`.
- ~~Jev falla en conteos y fechas como dice su documentación.~~ Refutado el 2026-10-10: acertó 15/15 contando productos y tres preguntas de fechas; la única duda real fue un plazo en días hábiles (confianza 0.64). Igual se enseña a resolverlos en código (R17), porque TypeSafe los lista como débiles (D4).

## Preguntas abiertas
- ~~Cuánto dura la charla~~ — resuelta: 25 minutos (15 + 6 + 4).
- ~~Cómo se protege la URL de la demo~~ — resuelta: no hay deploy.

## Alternativas a Jev

| Alternativa | Qué hace | En qué se diferencia de Jev |
|---|---|---|
| [Jev en Cloudflare Workers AI](https://developers.cloudflare.com/ai/models/typesafe/jev/) | El mismo modelo, servido por Cloudflare | Otra puerta al mismo Jev: 32k de contexto, sin retención de datos |
| [Cloudflare Clef](https://blog.cloudflare.com/clef-decision-models/) | Modelos de decisión con los mismos tipos de pregunta y probabilidades | Código abierto, se puede autohospedar, acepta imágenes y tiene más contexto |
| [AWS Strands Decider 2B](https://strandsagents.com/blog/introducing-strands-decider) | Modelo de decisión abierto: elige opciones, responde sí/no y puntúa con una confianza | Corre local en CPU o GPU, sin API hosteada, y se puede reentrenar con tus datos |
| [Galileo Luna](https://galileo.ai/research) | Modelos chicos para evaluar salidas de LLM: alucinaciones y métricas de calidad | Métricas fijas o entrenadas, no preguntas libres |
| [Jina Classifier](https://jina.ai/news/jina-classifier-for-high-performance-zero-shot-and-few-shot-classification) | API zero-shot: le pasás etiquetas y devuelve una con un score | Solo elegir una etiqueta; no tiene sí/no ni escalas |
| [Hugging Face zero-shot](https://huggingface.co/docs/inference-providers/tasks/zero-shot-classification) | Modelos abiertos como bart-large-mnli: un score por etiqueta | Se puede correr local, pero rinde menos con instrucciones complejas |
| [OpenAI Moderation](https://developers.openai.com/api/docs/guides/moderation) | Gratis: un score de 0 a 1 por categoría de contenido dañino | Categorías fijas: solo sirve para moderar |
| LLM con salida estructurada | Un modelo general responde en JSON siguiendo un schema | Genera texto aunque lo encorsetes, y la confianza no viene como dato |
