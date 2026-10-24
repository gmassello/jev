# ADR-0001: Jev por Vercel AI Gateway con el AI SDK

- **Estado:** aceptada · settled: user-directed
- **Fecha:** 2026-10-24

## Contexto
La charla enseña a llamar a Jev desde código propio, y el snippet que se copian los asistentes fija ese camino. Hay tres puertas al mismo modelo: Vercel AI Gateway con el AI SDK, la API nativa de TypeSafe con su SDK, y Cloudflare Workers AI. El playground ya usa la primera, y el AI SDK renombró `experimental_evaluate` a `experimental_decide` en `ai@7.0.128`.

## Decisión
Jev se llama por Vercel AI Gateway con el AI SDK (`experimental_decide`, `ai` en versión exacta), desde un server que guarda la key. La confianza de TypeSafe y el costo se leen de `providerMetadata`.

## Alternativas
- **API nativa de TypeSafe:** confianza, Noul y Box nativos, pero suma una dependencia, otra key y un snippet que no sirve a quien ya usa el AI SDK.
- **Cloudflare Workers AI:** deploy sin server propio, pero cambia de runtime y proveedor a 6 días de la charla, con 32k de contexto.

## Consecuencias
- El snippet es el mismo SDK que los devs usan para LLMs, y el costo de cada llamada viene en la respuesta (`gateway.cost`).
- Se depende de una API `experimental_*`: un patch puede cambiarla, así que `ai` va pinneado y el snippet se prueba al subir de versión.
- Salir es barato: cambiar de puerta toca solo `server.js` y el snippet.
