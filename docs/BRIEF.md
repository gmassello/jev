# Jev para devs — Brief

## Resumen
Una charla con demo en vivo donde el presentador proyecta un desafío: un set de tickets de soporte de ejemplo con su respuesta correcta, preguntas que el público dicta y un marcador que muestra en qué acierta Jev, con qué confianza y dónde falla. Los devs se van sabiendo qué es Jev, cuándo usarlo y cómo integrarlo.

## Marco del problema
Los compañeros son programadores que no conocen Jev. El riesgo es que lo vean como "otro chatbot" y lo usen donde no corresponde, o que no se animen a meterlo en su código. Una explicación teórica no alcanza: lo que hace falta entender (dónde falla, qué significa la confianza, cuánto cuesta) se aprende viéndolo acertar y equivocarse sobre casos concretos. El repo ya tiene el playground, la pestaña Docs técnica y la interfaz bilingüe (`index.html`, `server.js`); faltan el desafío, el deck, la demo deployada y el video (`docs/HACKATHON.md`).

## Actores
- A1. Presentador — proyecta el desafío, carga las preguntas que dicta el público y explica los resultados.
- A2. Asistentes (devs) — dictan preguntas, interpretan el marcador y proponen dónde usarían Jev.
- A3. Quien no pudo ir — ve el video y prueba la demo deployada por su cuenta.

## Requerimientos
- R1. El presentador puede correr un desafío con un set de tickets de soporte de ejemplo en español, cada uno con su respuesta esperada. [criterion: Entienden qué es Jev y qué no]
- R2. El público ve un marcador con los aciertos, la confianza de cada respuesta y los casos en que Jev se equivocó. [criterion: Entienden qué es Jev y qué no]
- R3. El set incluye una pregunta que pone a prueba una limitación que TypeSafe documenta (contar productos), y el desafío muestra el resultado medido tal cual: dónde acierta, dónde duda (confianza baja) y que las limitaciones se verifican midiendo, no leyendo la doc. [criterion: Entienden qué es Jev y qué no]
- R4. El presentador puede mover un umbral de confianza y el marcador muestra cuántos casos se automatizarían y cuántos irían a revisión humana. [criterion: Costo y riesgos claros]
- R5. Cada corrida del desafío muestra lo que costó y cuánto tardó. [criterion: Costo y riesgos claros]
- R6. Los asistentes tienen un camino para integrar Jev solos después de la charla: el snippet probado, la pestaña Docs y una slide de integración. [criterion: Pueden integrarlo solos]
- R7. La charla cierra con una consigna para que cada asistente nombre un caso de su trabajo donde usaría Jev, apoyada en el patrón visto en el desafío. [criterion: Detectan un caso propio]
- R8. Un deck en español (HTML + PDF) cubre qué es Jev, Jev vs. LLMs, System One, integración, costo y riesgos. [criterion: Entienden qué es Jev y qué no]
- R9. La demo está publicada en una URL protegida, para que se pueda probar sin instalar nada y sin exponer la key. [criterion: Costo y riesgos claros]
- R10. Un video corto en español recorre el desafío para quien no estuvo en la charla. [criterion: Pueden integrarlo solos]

## Flujos principales
- F1. **Desafío en vivo** — el presentador abre el desafío → el público dicta una pregunta sobre los tickets → Jev evalúa todo el set → el marcador muestra aciertos, confianza y errores → se comenta por qué falló donde falló. (A1, A2; R1, R2, R3)
- F2. **Calibrar el umbral** — con el marcador cargado, el presentador mueve el umbral → cambia cuántos casos se automatizan y cuántos se revisan → se discute dónde poner el corte. (A1, A2; R4, R5)
- F3. **De la charla al código** — al final, slide de integración y snippet de Docs → consigna de caso propio → cada asistente nombra un caso. (A2; R6, R7)
- F4. **Asíncrono** — quien no fue ve el video → abre la demo deployada → prueba el desafío o el playground. (A3; R9, R10)

## Ejemplos de aceptación
- AE1. **Covers R1.** Given el desafío abierto, when el presentador elige el set de tickets de soporte, then se ven los tickets en español con su respuesta esperada.
- AE2. **Covers R2.** Given una pregunta cargada, when se evalúa el set, then el marcador muestra cuántos acertó sobre el total y marca cada caso fallado con la respuesta de Jev, la esperada y su confianza.
- AE3. **Covers R3.** Given el set completo, when se evalúa la pregunta de conteo, then el marcador muestra el resultado medido de esa corrida (aciertos y confianza por ticket) junto a la limitación que declara la doc, sin forzar una falla.
- AE4. **Covers R4.** Given un marcador cargado, when el umbral pasa de 0.5 a 0.9, then baja la cantidad de casos automatizados, sube la de revisión humana, y los números cambian sin volver a llamar a Jev.
- AE5. **Covers R5.** Given una corrida terminada, then se muestran los tokens usados, el costo estimado en dólares y el tiempo total.
- AE6. **Covers R9.** Given la URL de la demo, when alguien sin acceso la abre, then no puede llamar a Jev.

## Decisiones clave
- Desafío con casos etiquetados — chosen over charla clásica y reemplazo en vivo de un LLM because enseña diseño de preguntas, fallas y calibración haciéndolo, y cubre los cuatro criterios. settled: user-approved
- Casos de ejemplo sintéticos — chosen over datos reales del equipo because evita la aprobación para mandar datos internos a un proveedor externo. settled: user-directed
- Dominio: tickets de soporte — chosen over fallas de tests y logs de producción because es el dominio que eligió el presentador. settled: user-directed
- El presentador proyecta y el público dicta — chosen over que cada asistente juegue en su navegador because no hacen falta keys ni accesos individuales durante la charla. settled: user-directed
- Mostrar el resultado real de la pregunta de conteo — chosen over buscar casos hasta que falle o cambiar a una trampa de plazos hábiles because forzar la falla sería elegir casos a medida; el mensaje pasa a ser "las limitaciones se miden con tus casos". settled: user-directed
- Todo el material de la charla en español — chosen over inglés (regla común de hackathon) because el público habla español; ver `CLAUDE.md`. settled: user-directed

## Scope boundaries
### Para después
- Que cada asistente juegue el desafío en su propio navegador durante la charla.
- Ranking o competencia entre asistentes.
### Fuera de este producto
- Integrar Jev en código propio en vivo durante la charla.
- Datos reales del equipo.
- Keys de AI Gateway individuales.
- Comparación en vivo contra un LLM.

## Supuestos
- Entre 10 y 20 tickets alcanzan para que el marcador diga algo y se evalúen en pocos segundos; si son pocos, un solo error mueve demasiado el porcentaje.
- ~~Jev falla en conteos y fechas como dice su documentación.~~ Refutado el 2026-10-10: acertó 15/15 contando productos (agrupado y exacto), conteos de 6 a 9 ítems y tres preguntas de fechas; la única duda real fue un plazo en días hábiles (confianza 0.64). R3 se reescribió para mostrar el dato medido.
- La red de la sala deja llegar a la demo deployada; si no, fallback a local por screen-share (`PENDIENTE.md`).

## Preguntas abiertas
- Cuánto dura la charla — blocks: R8, F1 | resolve before planning: no
- Cómo se protege la URL de la demo (Vercel Deployment Protection u otra) y si los asistentes van a tener acceso después — blocks: R9, F4 | resolve before planning: yes
