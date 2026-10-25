# Evaluar con Jev: de una pregunta cerrada a una decisión con probabilidad

- **Cuándo:** viernes 2026-10-30, 12:00 -03:00
- **Para quién:** compañeros devs
- **Repo:** https://github.com/gmassello/jev

## Esta semana (lun 19 – vie 23/10)

- [ ] Mandar la invitación de calendario y reservar la sala, o el link de la reunión
- [x] Definir la duración: unos 20 minutos de video (qué es, impacto y dónde usarlo) y después preguntas en vivo
- [x] Rehacer el deck: slides de impacto, costo, riesgos, dónde usarlo y consigna para el video
- [ ] Poner el título nuevo en la portada del deck y regenerar `docs/deck.pdf`
- [ ] Pedir aprobación para usar datos internos en el ejercicio, o confirmar que va con datos sintéticos

## Video (retomar lo pausado)

- [ ] Bajar el clip 1 de HeyGen como `video/clip-1.mov` y correr el gate de `build-voice.py`: todo `fitted` y `spread` < 9
- [ ] Generar un clip por beat de `video/script.tsv` (19) con el mismo avatar, voz, formato apaisado y 720p; varios beats pasan de 1 minuto, así que hace falta el plan pago de HeyGen
- [ ] Grabar la toma de pantalla del playground: `Cmd+Shift+5` en modo ventana, Chrome sin la franja de debugging
- [ ] Armar `video/out/demo.mp4` con `assemble-voice.sh`
- [ ] Mirarlo entero y confirmar que dura 21 minutos o menos

## Ejercicio guiado

- [ ] Elegir un caso real del equipo: tickets, logs o alertas
- [ ] Armar el `state` y la pregunta (tipo, opciones y definiciones)
- [ ] Probarlo en el playground y anotar qué confianza da; si duda, mostrar por qué

## Acceso para los asistentes

- [ ] Decidir: una key de AI Gateway por persona, o todos sobre la demo compartida
- [ ] Revisar el saldo y la cuota del gateway: un ensayo, la charla y el ejercicio suman llamadas

## Semana siguiente (lun 26 – jue 29/10)

- [ ] Ensayo 1: ver el video entero en la sala y practicar respuestas a preguntas
- [ ] Ajustar el deck y el guion con lo que salió del ensayo
- [ ] Ensayo 2, cronometrado
- [ ] `node scripts/demo-check.mjs --check` en verde
- [ ] Preparar el plan B: el video, `docs/deck.pdf` y el server local, por si falla la red o el gateway
- [ ] Commitear lo pendiente: `scripts/demo-check.mjs`, `video/script.tsv`, `.gitignore`, `CLAUDE.md` y este archivo

## El día (vie 30/10)

- [ ] 11:00: levantar el server con `PORT=3001 npm start` y correr `node scripts/demo-check.mjs --check`
- [ ] Cerrar las notificaciones y las apps que no hacen falta
- [ ] Subir el zoom del navegador para que se lea desde la sala
- [ ] Dejar las pestañas abiertas en el orden de la charla: deck, playground en el paso 1, video de respaldo

## Después

- [ ] Compartir el repo, el deck y el video en el canal del equipo
- [ ] Juntar el feedback y las preguntas que quedaron abiertas
