# Jev Playground

A minimal local app to try [`typesafe-ai/jev`](https://vercel.com/ai-gateway/models/jev) through Vercel AI Gateway.

Jev is not a chat model. It evaluates a **state** (text or JSON) against **typed questions** and returns probabilities instead of free text.

## Requirements

- Node 24+
- A Vercel AI Gateway API key

## Setup

```bash
cp .env.example .env   # fill in AI_GATEWAY_API_KEY
npm i
npm start              # http://localhost:3000
```

Optional variables: `PORT` (default `3000`) and `JEV_MODEL` (default `typesafe-ai/jev`).

The UI is available in English and Spanish: the selector in the top right switches the labels and the preloaded example, and remembers your choice.

## Question types

| Type | `criteria` | Answer |
|---|---|---|
| `boolean` | optional `{ true, false }` | `probability` (0–1) |
| `choice` | object `{ option: description }` | `choice` + `probabilities` |
| `score` | ordered array of levels (2 or more) | `score` + `probabilities` |

`score` is the zero-based, probability-weighted position in the `criteria` array (e.g. `2.19` ≈ third level).

```json
{
  "refunded": { "type": "boolean", "instructions": "Was a refund issued?" },
  "topic": {
    "type": "choice",
    "instructions": "What is the main topic?",
    "criteria": { "shipping": "Delivery problems", "billing": "Payments" }
  },
  "anger": {
    "type": "score",
    "instructions": "How angry is the customer?",
    "criteria": ["calm", "annoyed", "angry", "furious"]
  }
}
```

## API

`POST /evaluate` with `{ "state": ..., "questions": { ... } }` returns `answers`, `usage`, `warnings`, `modelId` and `ms`.

## Links

- [Jev on AI Gateway](https://vercel.com/ai-gateway/models/jev)
- [TypeSafe documentation](https://docs.typesafe.ai/introduction)

## License

[MIT](LICENSE)
