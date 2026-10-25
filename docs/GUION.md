# Guion del video

Charla "Evaluar con Jev: de una pregunta cerrada a una decisión con probabilidad", viernes 2026-10-30 12:00. Se proyecta un video grabado de unos 20 minutos, narrado por un avatar con la voz clonada del presentador (HeyGen), y después hay preguntas en vivo.

La narración completa, una oración por fila, está en `video/script.tsv`: `beat` es la toma, `en` el subtítulo y `es` lo que dice el avatar. Este archivo dice qué se ve en cada toma y de dónde sale cada cifra.

## Bloques

| Bloque | Tomas (`beat`) | Pantalla | Min |
|---|---|---|---|
| Apertura | apertura | avatar | 1,2 |
| Qué es | qué es · pasos 1, 2, 3, 5, 6 y 7 | playground | 7,2 |
| Jev y un LLM | cuándo · paso 8 | playground | 1,6 |
| Impacto | impacto · slides antes y después, costo y riesgos | deck | 3,9 |
| Dónde usarlo | dónde · pasos 5, 9, 10 y 11, y slide casos | playground y deck | 6,0 |
| Integración | código · paso 16 | playground | 0,5 |
| Cierre | cierre · slide consigna y avatar | deck y avatar | 1,1 |

Los minutos salen de contar las palabras de la columna `es` a 2,3 por segundo; el clip real de HeyGen manda.

## Cifras y su fuente

| Cifra | Comando |
|---|---|
| Probabilidad de sí entre 0,96 y 0,98 (paso 2), estafa 1,00 (paso 3), cuenta 1,00 (paso 5), facturación entre 0,63 y 0,71 (paso 7), inventada 0,98 (paso 9), ambiente 1,00 (paso 10), crítica entre 0,93 y 0,97 (paso 11, 0,93 en el playground) | `node scripts/demo-check.mjs --check`, tres corridas del 2026-10-24 |
| Reembolso 0,98, facturación 1, urgencia alta 0,86 (paso 6) | la respuesta del paso 6 en el playground, 2026-10-24 |
| Respuesta fiel 0,07, estafa en los dos órdenes | `python3 cases/medium/checks.py http://localhost:3001` (`cases/medium/SPEC.md`, medido el 2026-10-24) |
| 5 de 5 tickets claros con 0,9 o más; US$0,0162 cada 1000 tickets; tanda en menos de 3 s | `python3 cases/medium/checks.py http://localhost:3001`, línea `impact:` y resumen, tres corridas del 2026-10-24 |
| US$0,042 por millón de tokens de entrada | precio publicado del gateway |

Si al grabar la pantalla muestra otra cifra, se regraba la frase con la de la pantalla.

## Pasos

### what — ¿Qué es Jev?
Bloque: Qué es, toma "qué es · paso 1".
- **Mostrar:** los párrafos, la tabla Sistema 1 (Jev) / Sistema 2 (un LLM que razona) y la barra de pasos.

### boolean — Sí / No
Bloque: Qué es, toma "qué es · paso 2".
- **Mostrar:** apretar "Preguntarle a Jev", "98% de probabilidad de «sí»" con una sola barra, la línea "Jev devolvió un solo número, probability: 0.98…" y el pie con tokens, costo, modelo y tiempo. Al final, apuntar la línea "Podés cambiar el texto…".

### choice — Elegir una opción
Bloque: Qué es, toma "qué es · paso 3".
- **Mostrar:** apretar el botón, las barras con estafa en 1,00.

### score — Escala
Fuera del video: TypeSafe dice que el score está poco calibrado; queda en el playground.

### criteria — Opciones con definición
Bloque: Qué es, toma "qué es · paso 5", y repaso en "dónde · paso 5".
- **Mostrar:** las opciones con su descripción, apretar el botón y ver `cuenta` en 1,00. En el repaso no se aprieta nada: se recorre la pantalla ya respondida.

### multi — Todo junto
Bloque: Qué es, toma "qué es · paso 6".
- **Mostrar:** las tres respuestas y el pie con el costo.

### doubt — Cuando Jev duda
Bloque: Qué es, toma "qué es · paso 7".
- **Mostrar:** apretar el botón, las barras repartidas, `facturacion` debajo de 0,9, el aviso naranja de revisión y la línea de confianza aparte.

### when — Cuándo usar Jev y cuándo no
Bloque: Jev y un LLM, toma "cuándo · paso 8".
- **Mostrar:** la tabla y la frase final; los riesgos se cuentan después, sobre la slide.

### guard — Jev revisa a un LLM
Bloque: Dónde usarlo, toma "dónde · paso 9".
- **Mostrar:** la política y la respuesta del bot en el texto, apretar el botón, el sí con 0,98.

### regression — Por qué falló esta suite
Bloque: Dónde usarlo, toma "dónde · paso 10".
- **Mostrar:** el log en el texto (timeout, 503 y "pasó ayer"), las cuatro causas con su definición, apretar el botón y ver `ambiente` en 1,00.

### defects — Qué tan grave es este defecto
Bloque: Dónde usarlo, toma "dónde · paso 11".
- **Mostrar:** la descripción del defecto, las cuatro severidades, apretar el botón y ver `critica` con más de 0,9.

### similar — Proyectos parecidos
Fuera del video: queda en el playground. Si preguntan por alternativas, Clef (Cloudflare) y Strands Decider (AWS) son las más parecidas.

### glossary — Conceptos
Fuera del video: queda en el playground como repaso.

### arch — Cómo está armado este playground
Fuera del video: si preguntan dónde vive la key, en el server y nunca en el navegador.

### prod — Jev en tu sistema
Fuera del video: la checklist (key en el server, límite de gasto, timeout, versión fija del modelo) sirve para las preguntas de producción.

### code — Llevalo a tu código
Bloque: Integración, toma "código · paso 16".
- **Mostrar:** los tres comandos, el snippet y el botón Copiar. Corrido con la key, imprime "Rutear a cuenta".
