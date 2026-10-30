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
| Sitio | https://jev-514702007876.us-central1.run.app (pide clave: `gcloud secrets versions access latest --secret jev-access --project jev-playground-2610`) | ok, revisión jev-00003-864 (commit 1369987): 401 sin clave; con clave, título y copy de 12 pasos; caso chico 7/7 | 2026-10-29 |
| Submission | <URL publica, no /edit> | | |
| Tarjeta en la galeria | <URL de la galeria> | | |
| PR upstream | #<n> | | |
| Segundo checkout | `~/<ruta>` rama `<rama>` | | |
| Video | https://youtu.be/02vD79jJD0M (los 12 pasos, 7:46, voz sintética Diego; subtítulos es y en) | ok, público; oEmbed 200 | 2026-10-29 |
| Deck | `docs/deck.pdf` sha256 `935b4f5b4bb3` | ok, 11 slides de 1920×1080 (impacto y dónde usarlo; portada en vivo), umbral 0,7 (el que sugiere TypeSafe), ticket ambiguo nuevo, riesgos sin la primera opción | 2026-10-29 |

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

- **La demo sigue arriba durante la charla** — alarma: workflow `uptime` (todos los días 12:17 UTC; prueba 401 sin clave y la página con la clave del secreto `JEV_ACCESS_PASSWORD`); fallback: correr el playground en local (`PORT=3001 npm start`) y mostrarlo por screen-share.
- **Slot de calendario, sala o link de la reunión** — fallback: grabar el video corto antes, para que sirva aunque se mueva la charla.
- **Acceso a la API para los asistentes** (demo compartida protegida o una key de AI Gateway por persona) — fallback: el ejercicio guiado corre contra la demo deployada, sin keys individuales.
- **Aprobación para mandar datos internos a un proveedor externo** — fallback: el ejercicio guiado usa datos sintéticos (como los ejemplos Support/Review/Email del playground).

## Recursos facturables

- Proyecto GCP `jev-playground-2610` (Cloud Run `jev`, secretos `jev-gateway-key` y `jev-access`) — apagar: `gcloud projects delete jev-playground-2610`.
