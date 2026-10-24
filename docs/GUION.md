# Guion del presentador

Charla "Evaluar con Jev: de una pregunta cerrada a una decisión con probabilidad", viernes 2026-10-30 12:00. Lección en vivo de 15 minutos por 7 pasos, 6 de video y 4 de preguntas.

Antes de empezar: `PORT=3001 npm start`, `node scripts/demo-check.mjs --check` en verde, navegador al 125–150 % y la interfaz en español. Para saltar entre pasos se usan los puntos del stepper: el título de cada uno aparece al pasar el mouse.

Las cifras salen de `node scripts/demo-check.mjs --check` (2026-10-24), de `python3 cases/medium/checks.py http://localhost:3001` (SPEC medido el 2026-10-24) y del pie que muestra el gateway en cada respuesta. Si el viernes dan otro número, se dice el de la pantalla.

### what — ¿Qué es Jev?
Tiempo: 2 min
- **Decir:** "Jev no conversa: evalúa. Le das un texto y una pregunta cerrada, y te devuelve una respuesta con un número que dice qué tan probable es."
- **Mostrar:** los dos párrafos y la barra de pasos arriba.
- **Transición:** "Arranquemos por la pregunta más simple." → punto 2.

### boolean — Sí / No
Tiempo: 2 min
- **Decir:** "Un sí o no, con una probabilidad de 0 a 1. Vos elegís el umbral: arriba actúa solo, abajo lo mira una persona."
- **Mostrar:** apretar "Preguntarle a Jev". Sale sí, cerca de 1 (0,98 en `demo-check`).
- **Transición:** "Con sí o no no alcanza para rutear un ticket: necesitamos opciones." → punto 5.

### choice — Elegir una opción
Fuera de vivo: queda en el playground y en el video; se salta con el punto 5.

### score — Escala
Fuera de vivo: TypeSafe dice que el score está poco calibrado, así que no se muestra en vivo; queda en el playground.

### criteria — Opciones con definición
Tiempo: 2 min
- **Decir:** "Un nombre de opción suelto es ambiguo. Si cada opción lleva una descripción corta, Jev sabe qué entra en cada una. Así se rutea un ticket a un equipo."
- **Mostrar:** las opciones con su descripción y apretar el botón. El ticket de la contraseña va a `cuenta` (1,00 en `demo-check`).
- **Transición:** "¿Y si quiero más de una respuesta del mismo ticket?" → punto 6.

### multi — Todo junto
Tiempo: 2 min
- **Decir:** "En una sola llamada, varias preguntas sobre el mismo texto: ¿pide reembolso?, ¿a qué área va?, ¿qué tan urgente es? Cada una vuelve con su id."
- **Mostrar:** las tres respuestas y el pie con tokens, costo en US$, modelo y tiempo. El costo de una llamada ronda los US$0,00001.
- **Transición:** "Hasta acá Jev estaba seguro. Veamos qué pasa cuando no." → punto 7.

### doubt — Cuando Jev duda
Tiempo: 3 min
- **Decir:** "Este ticket habla de un pago, de un pedido y de un error de la app a la vez. Mirá cómo se reparten las barras: la probabilidad de la elegida queda debajo de 0,9 y el ticket va a revisión humana. Y abajo, la confianza de TypeSafe es otro número: mide qué tan concentrada está la distribución."
- **Mostrar:** apretar el botón. Ver `facturacion` debajo de 0,9 (entre 0,63 y 0,71 en las corridas del caso mediano y de `demo-check`), el aviso naranja de revisión y la línea de confianza aparte.
- **Transición:** "Entonces, ¿cuándo conviene Jev y cuándo no?" → punto 8.

### when — Cuándo usar Jev y cuándo no
Tiempo: 2 min
- **Decir:** "Si la salida es una decisión cerrada, Jev. Si es texto libre, un LLM. Si es una regla fija, código. Y antes de producción, tres riesgos: el texto que entra no es de confianza, Jev prefiere la primera opción cuando duda, y los números y fechas se calculan en código."
- **Mostrar:** la tabla y la lista de los tres riesgos.
- **Transición:** "Ahora, cómo lo llevás a tu código." → punto 14.

### guard — Jev revisa a un LLM
Fuera de vivo: va en el video y sirve de ejemplo para la consigna del caso propio. Jev marca como inventada la respuesta del bot que promete 90 días cuando la política dice 30 (0,98 en `demo-check`).

### similar — Proyectos parecidos
Fuera de vivo: queda en el playground. Si preguntan por alternativas, Clef (Cloudflare) y Strands Decider (AWS) son las más parecidas.

### glossary — Conceptos
Fuera de vivo: queda en el playground como repaso.

### arch — Cómo está armado este playground
Fuera de vivo: va en el video. Si preguntan dónde vive la key: en el server, nunca en el navegador.

### prod — Jev en tu sistema
Fuera de vivo: va en el video. La checklist (key en el server, límite de gasto, timeout, versión fija del modelo) sirve de respuesta para las preguntas de producción.

### code — Llevalo a tu código
Tiempo: 2 min
- **Decir:** "Todo lo que hicimos es una llamada a `experimental_decide` del AI SDK. Este archivo es el ruteo del paso 5 con el umbral: lo copian, instalan `ai`, exportan la key y lo corren."
- **Mostrar:** los tres comandos y el botón Copiar. Corrido con la key, imprime "Rutear a cuenta".
- **Transición:** "Ahora, 6 minutos de video con lo que no vimos en vivo, y después preguntas." → video → consigna: "nombren un caso de su trabajo donde una pregunta cerrada decide algo".
