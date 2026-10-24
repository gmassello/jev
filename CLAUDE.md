
@~/Documents/dotfiles/projects/hackathon/CLAUDE.md

## Idioma (excepción a las reglas comunes)

Este proyecto es una charla interna para devs que hablan español: `docs/`, el deck, el video, el ejercicio guiado y `PENDIENTE.md` van **en español**, no en inglés. El `README.md` va solo en inglés; la UI del playground sigue bilingüe (inglés por defecto + español). El código y los mensajes de commit siguen en inglés.

## Commands

```bash
npm ci                                              # instalar (ai pinneado a versión exacta)
PORT=3001 npm start                                 # dev: http://localhost:3001 (necesita AI_GATEWAY_API_KEY)
npm test                                            # suite completa (node --test, sin red)
node --test --test-name-pattern="<nombre del test>" # un solo test; sin ruta: node --test no acepta un directorio
                                                    # lint: no hay (sin dependencias nuevas)
                                                    # type-check: no hay (JS sin build)
                                                    # deploy: no hay (PLAN U7 en cut; la charla corre en local)
python3 cases/small/checks.py http://localhost:3001 # caso chico contra el server corriendo (4 llamadas reales a Jev)
node scripts/demo-check.mjs --check                # antes de grabar el video: cada afirmación del guion contra Jev real
```

**Gate antes de dar una tarea por terminada:** `npm test`, y si se tocó `server.js` o el contrato de `/evaluate`, también `python3 cases/small/checks.py http://localhost:3001` con el server levantado.

El server sirve solo `index.html` y los módulos de la lista `MODULES` de `server.js`: un `.js` nuevo que importe el navegador se agrega ahí, o el navegador recibe 404.
