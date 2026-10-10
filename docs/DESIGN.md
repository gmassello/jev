# Jev para devs — Design system

## Context

- **Proyecto:** Jev Playground, una app local que corre en una charla interna para programadores. La demo es la pestaña Desafío: 15 tickets de soporte, una pregunta, el marcador N/15, el umbral de confianza y el costo de la corrida (`docs/UX.md`). Se proyecta en una sala: el presentador maneja la pantalla y el público lee desde lejos.
- **Modo:** Adoptar. Los tokens de color que ya usaba `index.html` se conservan con sus nombres; el sistema completa lo que faltaba.
- **Base (contenido técnico):** escala tipográfica, espaciado de 4/8 px, controles con radio de 6 px, tablas densas, superficies sin sombra y separadas por líneas finas, y estados de hover, foco y deshabilitado.
- **Secundario (un rasgo):** el bloque de código estilo terminal, siempre oscuro en los dos temas, para el snippet de Integración y "Ver JSON".
- **Originalidad:** el acento azul propio del proyecto (corrido a `#2a62d9` en claro para pasar 4.5:1), Inter y JetBrains Mono de Google Fonts en lugar de las fuentes de marca, un marcador con contador animado y un modo proyector que escala todo el texto.

## Stack

Manda el stack del repo: HTML, CSS y JavaScript sin framework ni build, en `index.html`, servidos por `server.js` (Node, `node:http`). No hay Tailwind ni shadcn/ui, y no se agregan (regla de dependencias de `projects/hackathon/CLAUDE.md`). Los tokens son variables CSS en `:root`; los estilos se escriben a mano contra esos tokens. Las únicas cargas externas permitidas son las fuentes de Google Fonts.

## Tokens

Un solo sistema, en modo claro y oscuro. El tema sigue la regla **Frontend** de `projects/hackathon/CLAUDE.md`: tokens en `:root`, override por `data-theme` con `color-scheme` en cada bloque, preferencia del sistema (`prefers-color-scheme`) como default y un script inline en el `<head>` **antes** del CSS que aplica `data-theme` y `data-projector` guardados en `localStorage`, envuelto en try/catch.

```css
:root {
  color-scheme: light;
  --bg: #f7f7f8;
  --card: #ffffff;
  --text: #1a1a1a;
  --muted: #666666;
  --line: #dddddd;
  --border-strong: #858585;
  --accent: #2a62d9;
  --accent-soft: #2a62d922;
  --on-accent: #ffffff;
  --ring: #2a62d9;
  --ok: #157a40;
  --ok-soft: #157a4015;
  --bad: #c62828;
  --bad-soft: #c6282815;
  --warn: #ab570a;
  --warn-soft: #ab570a15;
  --code-bg: #101010;
  --code-fg: #f5f6f7;
  --code-muted: #8b949e;
  --font-sans: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  --fs-score: 4.5rem;
  --fs-display: 3rem;
  --fs-h1: 2rem;
  --fs-h2: 1.25rem;
  --fs-body: 1rem;
  --fs-sm: 0.875rem;
  --fs-xs: 0.75rem;
  --fs-code: 0.875rem;
  --lh-tight: 1.15;
  --lh-body: 1.55;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 2.5rem;
  --space-8: 4rem;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-pill: 9999px;
  --dur-fast: 150ms;
  --dur-count: 700ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --bg: #151517;
    --card: #202024;
    --text: #eeeeee;
    --muted: #999999;
    --line: #333333;
    --border-strong: #707070;
    --accent: #6b9bff;
    --accent-soft: #6b9bff26;
    --on-accent: #0b1020;
    --ring: #6b9bff;
    --ok: #4cc27f;
    --ok-soft: #4cc27f1f;
    --bad: #ff6b6b;
    --bad-soft: #ff6b6b1a;
    --warn: #f5a623;
    --warn-soft: #f5a6231f;
  }
}

:root[data-theme="dark"] {
  color-scheme: dark;
  --bg: #151517;
  --card: #202024;
  --text: #eeeeee;
  --muted: #999999;
  --line: #333333;
  --border-strong: #707070;
  --accent: #6b9bff;
  --accent-soft: #6b9bff26;
  --on-accent: #0b1020;
  --ring: #6b9bff;
  --ok: #4cc27f;
  --ok-soft: #4cc27f1f;
  --bad: #ff6b6b;
  --bad-soft: #ff6b6b1a;
  --warn: #f5a623;
  --warn-soft: #f5a6231f;
}

:root[data-projector="on"] { font-size: 125%; }
```

Uso semántico:

| Token | Para qué |
|---|---|
| `--bg` / `--card` | fondo de página / superficie de tarjetas, tablas e inputs |
| `--text` / `--muted` | texto principal / secundario, ayudas y pies |
| `--line` | separadores decorativos (filas de tabla, bordes de tarjeta) |
| `--border-strong` | borde de inputs, selects y slider: tiene que verse (3:1) |
| `--accent` / `--on-accent` | CTA principal, pestaña activa, links / texto sobre el acento |
| `--accent-soft` | pista de barras y del slider |
| `--ring` | anillo de foco |
| `--ok` / `--bad` / `--warn` (+ `-soft`) | acierto / fallo / "a revisión humana", con fondo suave para filas y badges |
| `--code-bg` / `--code-fg` / `--code-muted` | bloque terminal, igual en los dos temas |

Los colores no tienen config de Tailwind porque el repo no usa Tailwind.

## Typography

- **Familias:** Inter (texto) y JetBrains Mono (código, números del marcador, costo), de Google Fonts: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`. Sin otra familia.
- **Escala** (todo en `rem`, así el modo proyector escala con un solo valor):

| Rol | Token | Peso | Interlineado | Tracking |
|---|---|---|---|---|
| Marcador N/15 | `--fs-score` | 700, mono, `tabular-nums` | `--lh-tight` | -0.02em |
| Display (título de pantalla) | `--fs-display` | 600 | `--lh-tight` | -0.05em |
| H1 | `--fs-h1` | 600 | 1.25 | -0.04em |
| H2 (sección, título de tarjeta) | `--fs-h2` | 600 | 1.4 | -0.02em |
| Body | `--fs-body` | 400 | `--lh-body` | 0 |
| Small (tablas, ayudas) | `--fs-sm` | 400 / 500 en encabezados | 1.45 | 0 |
| Caption / eyebrow | `--fs-xs` | 500, mono | 1.35 | 0 |
| Código | `--fs-code` | 400, mono | 1.45 | 0 |

- Porcentajes, confianza, tokens, segundos y US$ van siempre en `--font-mono` con `font-variant-numeric: tabular-nums`, para que no salten al actualizarse.

## Spacing, grid, radii and shadows

- **Espaciado:** escala `--space-1` a `--space-8` (4, 8, 12, 16, 24, 32, 40, 64 px). Padding de tarjeta `--space-4`; separación entre tarjetas `--space-3`; entre secciones `--space-6`.
- **Layout:** una columna centrada, `max-width: 820px`, gutter lateral `--space-4`. La pestaña Desafío puede ensancharse a `1040px` para la tabla de 15 tickets. Sin scroll horizontal de página a 375 px: las tablas van dentro de un contenedor con `overflow-x: auto`.
- **Radios:** `--radius-sm` en botones, inputs, chips y bloques de código; `--radius-md` en tarjetas; `--radius-pill` en badges y en el pulgar del slider.
- **Sombras:** ninguna. Las superficies se separan con `1px solid var(--line)`. El foco no es una sombra decorativa: es el anillo de `--ring`.

## Components

Todos con hover, focus, disabled, loading y error. Foco: `outline: 2px solid var(--ring); outline-offset: 2px` en `:focus-visible`. Deshabilitado: `opacity: .5; cursor: not-allowed`. Transiciones de color con `--dur-fast`.

| Componente | Base | Hover | Loading | Error |
|---|---|---|---|---|
| **Botón primario** (un CTA por pantalla: "Evaluar los 15 tickets", "Preguntarle a Jev") | fondo `--accent`, texto `--on-accent`, 600, `--radius-sm`, padding `--space-3 --space-5`, ancho completo en la vista | fondo `--accent` con `filter: brightness(1.08)` | texto pasa al progreso ("Evaluando 6/15…"), `aria-busy="true"`, deshabilitado | n/a: el error va en el contenido, no en el botón |
| **Botón secundario** (chips de ejemplo, "Ver JSON", "Copiar", toggles) | fondo `--card`, borde `1px solid var(--line)`, texto `--text` | borde `--accent` | n/a | n/a |
| **Link-botón** ("+ Nueva pregunta", "¿Cómo leer esto?", "Así se hace en código →") | sin fondo ni borde, texto `--accent` | subrayado | n/a | n/a |
| **Input / textarea / select** | fondo `--card`, borde `1px solid var(--border-strong)`, `--radius-sm`, padding `--space-2` | borde `--text` | n/a | borde `--bad` + mensaje debajo en `--bad`, `--fs-sm`, formato "qué pasó. qué hacer." |
| **Tarjeta** | fondo `--card`, borde `--line`, `--radius-md`, padding `--space-4` | sin cambio | n/a | variante falla: fondo `--bad-soft`, borde y texto `--bad` |
| **Pestañas** (Desafío · Playground · Docs) | texto `--muted` 600, borde inferior transparente de 2 px | texto `--text` | n/a | n/a. Activa: texto `--accent` y borde inferior `--accent`; `role="tab"` y `aria-selected` |
| **Header** | título a la izquierda; a la derecha, en este orden: Idioma, Tema, Registro y Modo proyector, como botones secundarios compactos (`--fs-sm`) | — | — | — |
| **Tabla de tickets** | `--fs-sm`, filas con borde inferior `--line`, encabezados `--muted` 500 | fila con fondo `--accent-soft` | celda de resultado con "…" en `--muted` hasta que llega | fila fallada: fondo `--bad-soft` y badge "Falló" |
| **Badge** | `--radius-pill`, `--fs-xs` 500, padding `--space-1 --space-2` | — | — | Acierto: `--ok` sobre `--ok-soft`; Falló: `--bad` sobre `--bad-soft`; A revisión: `--warn` sobre `--warn-soft` |
| **Marcador** | número en `--fs-score` mono 700 + "aciertos" en `--fs-h2` `--muted` | — | muestra "—/15" en `--muted` mientras corre | si no respondió ninguna fila: tarjeta de falla con `errAllFailed` |
| **Slider de umbral** | pista `--accent-soft` 6 px, pulgar `--accent` pill de 18 px, valor actual en mono al lado | pulgar con anillo `--accent-soft` | — | — |
| **Contadores de umbral** | tres tarjetas en fila: Automáticos (`--ok`), A revisión humana (`--warn`), Errores que se automatizarían (`--bad`); número en `--fs-h1` mono | — | — | — |
| **Barra de probabilidad** (Playground) | pista `--accent-soft` 0.7 rem pill, relleno `--accent`, % en mono | — | — | — |
| **Bloque terminal** | fondo `--code-bg`, texto `--code-fg`, borde `1px solid var(--line)`, `--radius-sm`, `--fs-code` mono, padding `--space-4`, `overflow-x: auto`; botón "Copiar" arriba a la derecha | — | — | si falla el portapapeles, el botón no cambia de texto |
| **Pie de corrida** | `--fs-sm` mono `--muted`: "{n} tickets · {s} s · {tokens} tokens · US${usd} (entrada)", siempre con los valores de esa corrida | — | — | sin `usage`: "—" en lugar del número |

## Screens

Las pantallas son las de `docs/UX.md` (Proposed flow); acá solo se asignan componentes.

- **Header (todas):** título, Pestañas, Idioma, Tema, Registro y Modo proyector.
- **Desafío:** Tarjeta con la pregunta (Input + select de preguntas sugeridas), Botón primario "Evaluar los 15 tickets", Marcador, Tabla de tickets con Badges, Slider de umbral con Contadores de umbral, Pie de corrida, Link-botón "Así se hace en código →".
- **Playground:** Botones secundarios de ejemplo, Textarea, Tarjetas de pregunta (Input, Select, inputs de opciones), Botón primario "Preguntarle a Jev", Tarjetas de resultado con Barras de probabilidad, Pie de corrida, Botón secundario "Ver JSON" que abre un Bloque terminal, Link-botón "¿Cómo leer esto?".
- **Docs:** índice de Link-botones, Tarjetas colapsables por sección, Tablas, Bloques terminal con "Copiar", Botón primario "Probalo en el playground →".

## Effects

1. **Contador del marcador (protagonista)**, en la pestaña Desafío. Cuando termina la corrida, el número sube de 0 al valor medido en `--dur-count` con `--ease-out` (`requestAnimationFrame`), siempre en mono con `tabular-nums`. El valor final es el que devolvió la corrida: el contador nunca muestra un número que no salió de Jev. En el video, la cámara espera a que aterrice antes de cortar (regla "Todo número publicado sale de un comando").
   - `prefers-reduced-motion: reduce`: se muestra el valor final directamente, sin animar.
2. **Filas que se completan** (secundario y sobrio), en la Tabla de tickets: cada celda de resultado aparece con un fundido de opacidad de `--dur-fast` cuando llega su respuesta. Muestra el progreso sin otro spinner.
   - `prefers-reduced-motion: reduce`: aparece sin transición.

Nada más se anima. Los Contadores de umbral cambian al instante al mover el slider: la velocidad es el mensaje.

## Rules

- Usar solo los tokens de arriba. Ningún color, tamaño, radio o duración literal fuera de `:root`.
- Un solo color de acento (`--accent`). Verde, rojo y ámbar solo significan acierto, fallo y revisión; no son decorativos.
- Un CTA primario por pantalla.
- Ningún texto en los componentes: el copy sale de la tabla `I18N` (claves de `docs/UX.md` › Copy).
- Números medidos (marcador, confianza, tokens, tiempo, US$) en mono y sin redondear de más: no se reescriben para el registro "para dummies".
- No agregar sombras, gradientes, ilustraciones ni íconos de librerías.
- No crear componentes nuevos: si una pantalla necesita algo que no está en Components, se agrega acá primero.
- El bloque terminal es oscuro en los dos temas; el resto de las superficies sigue el tema.
- Todo `localStorage` va en try/catch y la página funciona igual sin él.

## Verification checklist

- [ ] **Tema:** alternar claro/oscuro desde el header y con la preferencia del sistema; sin parpadeo en la primera pintada (script inline antes del CSS).
- [ ] **Contraste medido (WCAG) en los dos temas**, con los valores de arriba:
  - claro: `--text`/`--bg` 16.26; `--muted`/`--bg` 5.36; `--accent`/`--bg` 5.10; `--on-accent`/`--accent` 5.46; `--ok`/`--card` 5.40; `--bad`/`--card` 5.62; `--warn`/`--card` 5.12; `--border-strong`/`--card` 3.69.
  - oscuro: `--text`/`--bg` 15.72; `--muted`/`--card` 5.70; `--accent`/`--bg` 6.74; `--on-accent`/`--accent` 6.99; `--ok`/`--card` 7.21; `--bad`/`--card` 5.85; `--warn`/`--card` 8.01; `--border-strong`/`--card` 3.28.
  - terminal: `--code-fg`/`--code-bg` 17.59; `--code-muted`/`--code-bg` 6.19.
  - `--line` (1.28–1.36) es solo decorativo: ningún control depende de él para verse.
- [ ] **Foco visible** con teclado en pestañas, botones, inputs, slider y "Copiar".
- [ ] **Responsive:** sin scroll horizontal de página a 375 px; las tablas hacen scroll dentro de su contenedor.
- [ ] **Modo proyector:** al activarlo, todo el texto escala al 125 % y el layout no se rompe a 1280 px.
- [ ] **Movimiento reducido:** con `prefers-reduced-motion: reduce`, el marcador muestra el valor final sin animar.
