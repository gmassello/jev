# Guion del video

Charla "Evaluar con Jev: de una pregunta cerrada a una decisión con probabilidad", viernes 2026-10-30 12:00. Se da en vivo sobre el playground, unos 20 minutos, y después hay preguntas. Este mismo guion es el del video de respaldo, narrado por un avatar con la voz clonada del presentador (HeyGen), para quien no pueda asistir o por si falla la red.

La narración completa, una oración por fila, está en `video/script.tsv`: `beat` es la toma, `en` el subtítulo y `es` lo que dice el avatar. Este archivo dice qué se ve en cada toma y de dónde sale cada cifra.

## Bloques

| Bloque | Tomas (`beat`) | Pantalla | Min |
|---|---|---|---|
| Apertura | apertura | avatar | 0,7 |
| Qué es | qué es · pasos 1 a 7 | playground | 7,9 |
| Jev y un LLM | cuándo · paso 8 | playground | 1,4 |
| Impacto | impacto · slides antes y después, costo y riesgos | deck | 3,2 |
| Dónde usarlo | dónde · pasos 5, 9, 10 y 11, y slide casos | playground y deck | 4,7 |
| Integración | código · pasos 13, 14 y 15 | playground | 1,4 |
| Cierre | cierre · paso 12, slide consigna y avatar | playground, deck y avatar | 1,4 |

El video recorre los 15 pasos del playground.

Los minutos salen de contar las palabras de la columna `es` a 2,3 por segundo; el clip real de HeyGen manda.

## Cifras y su fuente

| Cifra | Comando |
|---|---|
| Probabilidad de sí 0,98 en el problema resuelto (paso 2, seis corridas del 2026-10-27, es y en), estafa 1,00 (paso 3), cuenta 1,00 (paso 5), facturación entre 0,58 y 0,71, con envíos segunda entre 0,23 y 0,31 (paso 7, 2026-10-25), inventada 0,98 (paso 9), crítica entre 0,93 y 0,97 (paso 10, 0,93 en el playground) | `node scripts/demo-check.mjs --check`, tres corridas del 2026-10-24 |
| Score cerca de 1,9, unas tres estrellas (paso 4: 1,91, 1,93 y 1,93) | `node scripts/demo-check.mjs --check`, tres corridas del 2026-10-27 |
| Reembolso 0,98, facturación 1, urgencia alta 0,86 (paso 6) | la respuesta del paso 6 en el playground, 2026-10-24 |
| Respuesta fiel 0,07, estafa en los dos órdenes | `python3 cases/medium/checks.py http://localhost:3001` (`cases/medium/SPEC.md`, medido el 2026-10-24) |
| 5 de 5 tickets claros con 0,8 o más; US$0,0162 cada 1000 tickets; tanda en menos de 3 s | `python3 cases/medium/checks.py http://localhost:3001`, línea `impact:` y resumen, tres corridas del 2026-10-24 |
| US$0,042 por millón de tokens de entrada | precio publicado del gateway |

Si al grabar la pantalla muestra otra cifra, se regraba la frase con la de la pantalla.

## Pasos

### what — ¿Qué es Jev?
Bloque: Qué es, toma "qué es · paso 1".
- **Mostrar:** los párrafos y la barra de pasos.

### boolean — Sí / No
Bloque: Qué es, toma "qué es · paso 2".
- **Mostrar:** apretar "Preguntarle a Jev", "98% de probabilidad de «sí»" con una sola barra, la línea "Jev devolvió un solo número, probability: 0.98…" y el pie con tokens, costo, modelo y tiempo. Al final, apuntar la línea "Podés cambiar el texto…".

### choice — Elegir una opción
Bloque: Qué es, toma "qué es · paso 3".
- **Mostrar:** apretar el botón, las barras con estafa en 1,00.

### score — Escala
Bloque: Qué es, toma "qué es · paso 4".
- **Mostrar:** la reseña de los auriculares, las cinco estrellas, apretar el botón y ver el score cerca de 1,9 con las barras por nivel. Se dice que TypeSafe lo da como poco calibrado.

### criteria — Opciones con definición
Bloque: Qué es, toma "qué es · paso 5", y repaso en "dónde · paso 5".
- **Mostrar:** las opciones con su descripción, apretar el botón y ver `cuenta` en 1,00. En el repaso no se aprieta nada: se recorre la pantalla ya respondida.

### multi — Todo junto
Bloque: Qué es, toma "qué es · paso 6".
- **Mostrar:** las tres respuestas y el pie con el costo.

### doubt — Cuando Jev duda
Bloque: Qué es, toma "qué es · paso 7".
- **Mostrar:** apretar el botón, las barras repartidas, la línea "La elegida tiene N%; la que sigue, «envios», M%" (envíos queda segunda, cerca de un cuarto) y la línea de confianza aparte.

### when — Riesgos antes de producción
Bloque: Jev y un LLM, toma "cuándo · paso 8".
- **Mostrar:** la tabla de usos con su ejemplo en el playground, la tabla de riesgos (riesgo, qué puede pasar, qué hacer) y la frase final; los riesgos se narran después, sobre la slide.

### guard — Jev revisa a un LLM
Bloque: Dónde usarlo, toma "dónde · paso 9".
- **Mostrar:** la política y la respuesta del bot en el texto, apretar el botón, el sí con 0,98.

### defects — Proponer severidad de un defecto
Bloque: Dónde usarlo, toma "dónde · paso 10".
- **Mostrar:** la descripción del defecto, las cuatro severidades, apretar el botón y ver `critica` con más de 0,9.

### similar — Proyectos parecidos
Bloque: Dónde usarlo, toma "dónde · paso 11".
- **Mostrar:** la tabla, con las filas de Clef y Strands Decider, y el párrafo final.

### glossary — Conceptos
Bloque: Cierre, toma "cierre · paso 12".
- **Mostrar:** la tabla de conceptos, bajando despacio de `state` a `usage`.

### arch — Cómo está armado este playground
Bloque: Integración, toma "código · paso 13".
- **Mostrar:** la línea navegador → server → AI Gateway → Jev, la tabla de opciones A, B y C, y el bloque de configuración.

### prod — Jev en tu sistema
Bloque: Integración, toma "código · paso 14".
- **Mostrar:** el diagrama de la compuerta con el umbral y la checklist.

### code — Llevalo a tu código
Bloque: Integración, toma "código · paso 15".
- **Mostrar:** los tres comandos, el snippet y el botón Copiar. Corrido con la key, imprime "Rutear a cuenta".
