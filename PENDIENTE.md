# Pendiente — cierre Jev for developers (charla interna)

Charla: **Evaluar con Jev: de una pregunta cerrada a una decisión con probabilidad**. Tareas por día en `docs/PRESENTACION.md`.

Cierre: **2026-10-30 12:00 -03:00** (hora argentina, igual a la local). Competencia:
no publicada (charla interna) · Submission: no aplica · PR: no aplica.

Etapas (respuestas del presentador, sin página de evento): presentación 2026-10-30 12:00 -03:00, entregables listos antes de la presentación (sin fecha), seguimiento no publicado.

Estado del codigo en una linea: <N tests verdes, que esta hecho, que falta>.

---

## Superficies

| Superficie | Donde | Estado | Verificado |
|---|---|---|---|
| Repo y CI | `<owner>/<repo>` @ `<sha>` | | |
| Sitio | <URL> | | |
| Submission | <URL publica, no /edit> | | |
| Tarjeta en la galeria | <URL de la galeria> | | |
| PR upstream | #<n> | | |
| Segundo checkout | `~/<ruta>` rama `<rama>` | | |
| Video | `<id>` | | |
| Deck | `docs/deck.pdf` sha256 `<hash>` | | |

## Hechos duplicados

| Hecho | Valor real | Comando que lo produce | Copias |
|---|---|---|---|
| Cantidad de tests | | `uv run pytest -q \| tail -1` | |
| Archivos del PR | | `gh pr view <n> --json files --jq '.files\|length'` | |
| Version | | | |

## Lo que no cierra

Lo que no funciona, con el motivo. Esto es lo que evita prometer de mas en el formulario, y en una
competencia donde todos prometen, decirlo es diferencial.

- **<Cosa>** — <por que no cierra, y que haria falta para cerrarla>.

## No romper esto al volver

Las trampas del repo, para el que lo toque dentro de tres dias (que sos vos, sin contexto).

- `<script>` borra `<directorio gitignoreado>`: si se corre, se pierde <que>.
- `<archivo generado>` tiene que copiarse tambien a `<segundo lugar>`.
- `<test>` fija el output de `<comando>`: cambiar el formato obliga a reconciliarlo a mano.

## Fuera de mi control

No son tareas: son riesgos. Cada uno con su fallback.

- **La demo sigue arriba durante la charla** — alarma: workflow `uptime` (cada 6 h); fallback: correr el playground en local (`PORT=3001 npm start`) y mostrarlo por screen-share.
- **Slot de calendario, sala o link de la reunión** — fallback: grabar el video corto antes, para que sirva aunque se mueva la charla.
- **Acceso a la API para los asistentes** (demo compartida protegida o una key de AI Gateway por persona) — fallback: el ejercicio guiado corre contra la demo deployada, sin keys individuales.
- **Aprobación para mandar datos internos a un proveedor externo** — fallback: el ejercicio guiado usa datos sintéticos (como los ejemplos Support/Review/Email del playground).
