# Evaluar con Jev — Design system

## Context

- **Proyecto:** Jev Playground, una lección guiada de 13 pasos que se proyecta en la charla interna del 2026-10-30 ("Evaluar con Jev: de una pregunta cerrada a una decisión con probabilidad"). El presentador maneja la pantalla y el público, devs, lee desde lejos (`docs/UX.md`, Review 2026-10-24).
- **Modo:** Adoptar. Los tokens salen de los estilos que ya tiene `index.html`; este documento los nombra y fija las reglas. Revisado el 2026-10-24 para que coincida con el código: ya no hay pestaña Desafío, marcador, tema oscuro ni modo proyector.
- **Rasgo heredado:** el bloque de código estilo terminal, oscuro sobre la página clara, para el snippet, el diagrama y el JSON.
- **Decisiones propias:** acento azul `#2a62d9` (pasa 4.5:1 sobre blanco), fuentes del sistema (sin cargas externas: la página anda sin red en la sala) y un solo tema, claro, como pidió el presentador.

## Stack

HTML, CSS y JavaScript sin framework ni build, en `index.html` y `copy.js`, servidos por `server.js` (Node, `node:http`). Sin Tailwind, sin librería de componentes y sin dependencias nuevas (`projects/hackathon/CLAUDE.md` § Dependencias). Los tokens son variables CSS en `:root` y los estilos se escriben a mano contra ellos. Sin fuentes externas.

## Tokens

Un solo tema, claro. El oscuro queda para después (ver Rules).

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
  --font-sans: system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
  --fs-h1: 1.6rem;
  --fs-title: 1.5rem;
  --fs-verdict: 1.4rem;
  --fs-body: 1rem;
  --fs-sm: .9rem;
  --fs-xs: .8rem;
  --fs-code: 13px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-pill: 99px;
  --dur-fast: 150ms;
}
```

| Token | Uso |
|---|---|
| `--bg` / `--card` | fondo de la página / tarjetas, inputs, tablas |
| `--text` / `--muted` | texto principal / ayudas, encabezados de tabla, "Paso N de M" |
| `--line` / `--border-strong` | bordes y separadores / borde de inputs con foco débil |
| `--accent` / `--accent-soft` / `--on-accent` | botón principal, links, barras / fondo de explicaciones y badges / texto sobre el acento |
| `--ok`, `--bad`, `--warn` (+ `-soft`) | veredicto sí, veredicto no y errores, aviso de revisión humana |
| `--code-bg` / `--code-fg` | bloque de código, diagrama y JSON |

### Contraste medido (2026-10-24, WCAG, colores `-soft` compuestos sobre `--card`)

| Par | Ratio |
|---|---|
| `--text` / `--bg` | 16.26 |
| `--muted` / `--bg` | 5.36 |
| `--muted` / `--card` | 5.74 |
| `--accent` / `--card` | 5.46 |
| `--text` / `--accent-soft` | 14.43 |
| `--accent` / `--accent-soft` | 4.52 |
| `--warn` / `--warn-soft` | 4.58 |
| `--bad` / `--bad-soft` | 4.94 |
| `--ok` / `--card` | 5.40 |
| `--on-accent` / `--accent` | 5.46 |
| `--code-fg` / `--code-bg` | 17.59 |

Todos los pares de texto dan 4.5:1 o más. `--accent` sobre `--accent-soft` es el más justo: no bajar la opacidad de `--accent-soft` sin volver a medir.

## Typography

- **Familias:** `--font-sans` (system-ui) para todo el texto y `--font-mono` para código, comandos y JSON.
- **Escala:** `--fs-h1` (título de la app), `--fs-title` (título del paso), `--fs-verdict` (veredicto), `--fs-body` (texto), `--fs-sm` (tablas, barras, stepper), `--fs-xs` (badges, botón Copiar), `--fs-code` (bloques oscuros).
- **Pesos:** 400 texto, 600 encabezados de tabla, badges y botón principal, 700 veredicto y fila ganadora de las barras.
- **Interlineado:** 1.5 en explicaciones; el resto, el del navegador.
- **Números:** `font-variant-numeric: tabular-nums` en los porcentajes.

## Spacing, grid, radii and shadows

- **Columna:** una sola, `max-width: 820px`, centrada, con `1rem` de margen lateral y `1.5rem` arriba.
- **Espaciado:** en `rem`, entre `.25rem` y `2rem`; las tarjetas usan `1rem` de padding y `.8rem` de separación.
- **Radios:** `--radius-sm` en botones e inputs, `--radius-md` en tarjetas y bloques de código, `--radius-pill` en badges, barras y puntos del stepper.
- **Sombras:** ninguna. Las superficies se separan con `1px solid var(--line)`.

## Components

| Componente | Clase / id | Estados |
|---|---|---|
| Stepper | `.stepper`, `#step-of`, `#dots` | punto hecho (`--accent`), pendiente (`--line`); con U12, cada punto es un botón con foco visible y el título del paso como nombre |
| Navegación | `.step-nav` (arriba `.top` y abajo) | Anterior e Inicio ocultos en el paso 1; Siguiente oculto en el último; "Empezar" en el paso 1; hover con borde `--accent` |
| Botón | `button` | normal (`--card`, borde `--line`), hover (borde `--accent`), deshabilitado (opacidad .6, cursor de espera) |
| Botón principal | `#run` | `--accent` con `--on-accent`, ancho completo; "Pensando…" mientras espera |
| Link | `.link`, `td a`, `summary` | color `--accent` |
| Teoría | párrafos del paso | texto `--text` |
| Tabla | `.table-wrap > table` | encabezado `--muted` 600; primera columna 600; scroll horizontal propio en pantallas angostas |
| Bloque de código | `.code` + `pre` + botón Copiar | `--code-bg`/`--code-fg`; Copiar → "¡Copiado!" por 1.5 s |
| Diagrama | `.code` + `pre`, sin botón | igual al bloque de código |
| Lista | `ul` del paso | viñetas del navegador |
| Comandos | `ol.commands` | cada comando en `--font-mono` sobre `--accent-soft` |
| Badge de tipo | `.type-badge` | `--accent` sobre `--accent-soft`, `--radius-pill` |
| Pregunta editable | `.card` con `input`, `textarea`, opciones `.opt` | foco con `--ring`; quitar opción `.x` (hover `--bad`); "+ agregar opción" `.link` |
| Resultado | `.card.answer`, `.verdict`, `.bar-row` | veredicto `.yes` (`--ok`) o `.no` (`--bad`); fila ganadora `.win` en 700 |
| Explicación | `.explain` | `--accent-soft`; aviso de revisión `.explain.review` en `--warn` sobre `--warn-soft` |
| Error | `.card.fail`, `.error` | `--bad` sobre `--bad-soft` |
| JSON | `details#json` | plegado por defecto; request y respuesta en bloques oscuros |

## Screens

Una sola página con un paso a la vez (`docs/UX.md`, Review 2026-10-24).

- **Paso de teoría** (qué es, cuándo usar, parecidos, glosario, arquitectura, Jev en tu sistema): título, párrafos, y lo que tenga el paso (tabla, diagrama, lista); al final, la explicación.
- **Paso de práctica** (sí/no, opción, escala, definiciones, todo junto, cuando duda): teoría arriba, después "El texto", "La pregunta" y el botón principal; al responder, el resultado con barras, la explicación y, en el paso que duda, el aviso de revisión. El JSON queda plegado abajo.
- **Paso de código:** teoría, comandos numerados, bloque de código con Copiar y la explicación de cierre.

Lo primero que se ve en cada paso es el stepper ("Paso N de 13") y el título.

## Effects

Ninguno animado. Se sacaron el contador del marcador y el modo proyector. Para la sala, zoom del navegador al 125–150 % (`docs/PRESENTACION.md`). Las únicas transiciones son de hover, de `--dur-fast`, y se apagan con `prefers-reduced-motion: reduce`.

## Rules

- Todo color, tamaño y radio sale de un token de este documento; nada de literales en `index.html` (los que quedan los saca la unidad U21 del PLAN).
- Un solo tema, claro. El oscuro y su toggle quedan para después: si vuelven, se agregan con override por `data-theme` y se mide el contraste del tema nuevo.
- Sin fuentes externas, sin sombras, sin librerías de componentes.
- Un componente nuevo se agrega a la tabla de Components con sus estados antes de usarse.
- `--accent-soft` no baja de su opacidad actual sin volver a medir el contraste.

## Verification checklist

- [ ] El script de contraste da 4.5:1 o más en todos los pares de la tabla.
- [ ] `index.html` no tiene literales de color fuera de `:root` (`grep -n '#[0-9a-fA-F]\{6\}' index.html` solo dentro de `:root`, después de U21).
- [ ] A 375 px no hay scroll horizontal de la página; las tablas y los bloques de código hacen scroll propio.
- [ ] Foco visible con teclado en botones, inputs y puntos del stepper.
- [ ] Con `prefers-reduced-motion: reduce` no hay transiciones.
- [ ] La preview usa exactamente los tokens de este documento.
