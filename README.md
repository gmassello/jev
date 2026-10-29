# Jev Playground

A step-by-step playground to learn [Jev](https://vercel.com/ai-gateway/models/jev), TypeSafe's evaluation model, through Vercel AI Gateway.

## Watch and read

Both walk through the 12 steps of the playground, in Spanish.

- [Video](https://youtu.be/02vD79jJD0M): 7:46, synthetic narration, English and Spanish subtitles.
- [PDF](docs/charla.pdf): every step with a real Jev answer, 21 pages.

## Setup

Requires Node 24+ and a [Vercel AI Gateway](https://vercel.com/ai-gateway) API key.

```bash
cp .env.example .env   # set AI_GATEWAY_API_KEY
npm ci
npm start              # http://localhost:3000
```

Optional: `PORT` (default `3000`) and `JEV_MODEL` (default `typesafe-ai/jev`). Run the tests with `npm test`.

## Deploy

The hosted playground runs on Cloud Run and asks for a password (HTTP basic auth). Set `ACCESS_PASSWORD` to turn that on anywhere; without it the server is open, as in local use.

```bash
gcloud run deploy jev --source . --region us-central1 --project jev-playground-2610 --allow-unauthenticated --update-secrets AI_GATEWAY_API_KEY=jev-gateway-key:latest,ACCESS_PASSWORD=jev-access:latest
```

Both the gateway key and the password live in Secret Manager, never in the repo.

## Use it in your code

Save this as `jev.mjs` and run:

```bash
npm i ai@7.0.153
export AI_GATEWAY_API_KEY=...
node jev.mjs
```

```js
import { experimental_decide as decide } from 'ai';

const { answers } = await decide({
  model: 'typesafe-ai/jev',
  state: 'I have not been able to log into my account since yesterday: it says my password is wrong.',
  questions: {
    area: {
      type: 'choice',
      instructions: 'Which team does this ticket go to?',
      criteria: {
        billing: 'Charges, invoices and refunds',
        tech: 'Website or app errors',
        account: 'Access, security and account data',
      },
    },
  },
});

const { choice, probabilities } = answers.area;
if (probabilities[choice] >= 0.7) console.log('Route to', choice);
else console.log('Send to human review:', probabilities);
```

Change the text, the options or the threshold, and you have your first router with Jev.

## Before you use it in production

- **Calibrate the threshold on your own data.** Label a few dozen real cases and check how often Jev is right at each probability level before letting it act on its own.
- **Measure the limits, don't read them.** TypeSafe documents counting and dates as weak spots, yet both worked in our tests; your cases may go the other way.
- **Keep the key on the server.** Call Jev from your backend, never from the browser, and never commit the key.

## License

[MIT](LICENSE)
