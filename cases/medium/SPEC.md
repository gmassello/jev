# Caso mediano — 5 tickets en tanda

Subconjunto de la entrega: cinco tickets de soporte con su área esperada, evaluados como los evalúa el desafío (una llamada por ticket, concurrencia 5, contra `POST /evaluate`). Sube la dificultad respecto del caso chico, porque el resultado depende de que Jev clasifique bien varios tickets distintos y de que el sistema aguante la tanda.

## Actores
- A1. Presentador — corre la tanda desde la pestaña Desafío o desde un script.

## Requerimientos
- R1. Los 5 tickets se evalúan en una sola tanda con la misma pregunta `choice`.
- R2. Jev acierta el área de al menos 4 de los 5 tickets.
- R3. La tanda completa responde rápido y barato, en vivo frente al público.

## Datos
Pregunta `team` (`choice`): "¿A qué área va este ticket?" con `facturacion` (cobros, facturas y reembolsos), `envios` (entregas y logística), `tecnica` (errores y caídas de la app) y `cuenta` (acceso y datos de la cuenta).

| # | Ticket | Esperado |
|---|---|---|
| 1 | Me debitaron dos veces la cuota de noviembre y necesito que reintegren uno de los cobros. | facturacion |
| 2 | Compré el jueves y el paquete sigue figurando "en preparación". ¿Cuándo llega? | envios |
| 3 | La app se cierra sola cada vez que intento abrir el carrito desde el celular. | tecnica |
| 4 | No puedo entrar: me dice que mi correo no está registrado, pero tengo cuenta hace dos años. | cuenta |
| 5 | Necesito la factura A de mi última compra a nombre de la empresa. | facturacion |

## Ejemplos de aceptación
- AE1. **Covers R1.** Given los 5 tickets, when se evalúan con concurrencia 5, then las 5 llamadas responden 200 y cada respuesta trae `choice` y `probabilities` con las cuatro opciones.
- AE2. **Covers R2.** Given las 5 respuestas, then al menos 4 tienen `choice` igual al esperado.
- AE3. **Covers R3.** Given la tanda, then el tiempo total de punta a punta es menor a 10 s y el costo estimado de entrada (suma de `inputTokens` × US$0.042 / 1.000.000) es menor a US$0.001.

## Contrato de runtime
- **URL base:** la del server (`npm start` usa el puerto 3000; la charla, `PORT=3001`).
- **Health / reset:** no hay; el server no tiene estado.
- **`POST /evaluate`:** el mismo contrato que el caso chico (`cases/small/SPEC.md`).
- **Requiere:** `AI_GATEWAY_API_KEY` en el entorno del server. Cada corrida hace 5 llamadas reales a Jev.
