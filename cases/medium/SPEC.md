# Caso mediano — 5 tickets en tanda

Subconjunto de la entrega: cinco tickets de soporte con su área esperada, evaluados como los evalúa el desafío (una llamada por ticket, concurrencia 5, contra `POST /evaluate`). Sube la dificultad respecto del caso chico, porque el resultado depende de que Jev clasifique bien varios tickets distintos y de que el sistema aguante la tanda.

## Actores
- A1. Presentador — corre la tanda desde la pestaña Desafío o desde un script.

## Requerimientos
- R1. Los 5 tickets se evalúan en una sola tanda con la misma pregunta `choice`.
- R2. Jev acierta el área de al menos 4 de los 5 tickets.
- R3. La tanda completa responde rápido y barato, en vivo frente al público.
- R4. El ticket ambiguo de la lección queda por debajo del umbral en cada corrida, no solo en una (BRIEF R12).
- R5. La elección no depende del orden de las opciones (BRIEF R17, sesgo hacia la primera opción).
- R6. Jev distingue una respuesta de chatbot que inventa un dato de una que respeta la política (BRIEF R18).
- R7. El costo que informa el gateway para la tanda es chico (BRIEF R16; `docs/ARCHITECTURE.md` § Contracts).

## Datos
Pregunta `team` (`choice`): "¿A qué área va este ticket?" con `facturacion` (cobros, facturas y reembolsos), `envios` (entregas y logística), `tecnica` (errores y caídas de la app) y `cuenta` (acceso y datos de la cuenta).

| # | Ticket | Esperado |
|---|---|---|
| 1 | Me debitaron dos veces la cuota de noviembre y necesito que reintegren uno de los cobros. | facturacion |
| 2 | Compré el jueves y el paquete sigue figurando "en preparación". ¿Cuándo llega? | envios |
| 3 | La app se cierra sola cada vez que intento abrir el carrito desde el celular. | tecnica |
| 4 | No puedo entrar: me dice que mi correo no está registrado, pero tengo cuenta hace dos años. | cuenta |
| 5 | Necesito la factura A de mi última compra a nombre de la empresa. | facturacion |

**Ticket ambiguo** (`choice`, "¿A qué área va este ticket?" con `facturacion`, `envios`, `tecnica`, sin definiciones): "Quiero cancelar el pedido que todavía no llegó y que me devuelvan la plata."

**Mail** (`choice`, "¿Qué tipo de mail es?"): "¡FELICITACIONES! Ganaste un iPhone. Hacé clic acá en las próximas 24 horas para reclamar tu premio: bit.ly/premio-ya", con las opciones en dos órdenes: `Trabajo, Personal, Promoción, Estafa` y `Estafa, Trabajo, Personal, Promoción`.

**Guardrail** (`boolean`, "¿La respuesta del asistente afirma algo que la política no dice?"), con el texto "Política de la tienda: las devoluciones se aceptan hasta 30 días después de la compra, con el ticket." seguido de una de dos conversaciones:
- A: "Cliente: ¿hasta cuándo puedo devolver? Asistente: Tenés hasta 90 días para devolverlo, sin ticket." → sí
- B: "Cliente: ¿hasta cuándo puedo devolver? Asistente: Tenés hasta 30 días desde la compra, con el ticket." → no

Medido el 2026-10-24, 3 corridas: A 0,98/0,98/0,98; B 0,07/0,06/0,07; ambiguo 0,63/0,67/0,66; con el ticket nuevo del 2026-10-29, 0,52/0,51/0,51 (una vez eligió `envios`); el mail dio `Estafa` en los dos órdenes.

## Ejemplos de aceptación
- AE1. **Covers R1.** Given los 5 tickets, when se evalúan con concurrencia 5, then las 5 llamadas responden 200 y cada respuesta trae `choice` y `probabilities` con las cuatro opciones.
- AE2. **Covers R2.** Given las 5 respuestas, then al menos 4 tienen `choice` igual al esperado.
- AE3. **Covers R3.** Given la tanda, then el tiempo total de punta a punta es menor a 10 s y el costo estimado de entrada (suma de `inputTokens` × US$0.042 / 1.000.000) es menor a US$0.001.

- AE4. **Covers R4.** Given el ticket ambiguo, when se evalúa 3 veces, then en las 3 la probabilidad de la opción elegida es menor a 0,7.
- AE5. **Covers R5.** Given el mail, when se evalúa con las opciones en los dos órdenes, then las dos respuestas eligen `Estafa`.
- AE6. **Covers R6.** Given la política, then con la conversación A la probabilidad de sí es ≥ 0,7 y con la B es ≤ 0,3.
- AE7. **Covers R7.** Given las 5 respuestas de la tanda, then cada una trae `cost` (número ≥ 0, en US$) y la suma es menor a US$0,001.

## Contrato de runtime
- **URL base:** la del server (`npm start` usa el puerto 3000; la charla, `PORT=3001`).
- **Health / reset:** no hay; el server no tiene estado.
- **`POST /evaluate`:** el mismo contrato que el caso chico (`cases/small/SPEC.md`).
- **Requiere:** `AI_GATEWAY_API_KEY` en el entorno del server. Cada corrida hace 12 llamadas reales a Jev (5 de la tanda, 3 del ambiguo, 2 del mail, 2 del guardrail).
