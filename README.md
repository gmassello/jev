# Jev Playground

A step-by-step playground to learn [Jev](https://vercel.com/ai-gateway/models/jev), TypeSafe's evaluation model, through Vercel AI Gateway.

## Setup

Requires Node 24+ and a [Vercel AI Gateway](https://vercel.com/ai-gateway) API key.

```bash
cp .env.example .env   # set AI_GATEWAY_API_KEY
npm ci
npm start              # http://localhost:3000
```

Optional: `PORT` (default `3000`) and `JEV_MODEL` (default `typesafe-ai/jev`). Run the tests with `npm test`.

## Before you use it in production

- **Calibrate the threshold on your own data.** Label a few dozen real cases and check how often Jev is right at each probability level before letting it act on its own.
- **Measure the limits, don't read them.** TypeSafe documents counting and dates as weak spots, yet both worked in our tests; your cases may go the other way.
- **Keep the key on the server.** Call Jev from your backend, never from the browser, and never commit the key.

## License

[MIT](LICENSE)
