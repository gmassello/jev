export const I18N = {
  es: {
    locale: 'es-AR',
    tabPlayground: 'Playground',
    tabDocs: 'Docs',
    tabChallenge: 'Desafío',
    challengeTitle: 'Desafío: 15 tickets de soporte',
    challengeIntro_plain: 'Jev clasifica 15 tickets de soporte y comparamos su respuesta con la correcta.',
    challengeIntro_tech: 'Evaluación de 1 pregunta sobre 15 tickets etiquetados: aciertos, confianza por caso y fallas.',
    challengeSuggested: 'Pregunta sugerida',
    challengeQuestion: 'Texto de la pregunta (podés reformularla)',
    challengeTrapNote: 'TypeSafe dice que a Jev le cuesta contar. Medilo.',
    challengeRun: (n) => `Evaluar los ${n} tickets`,
    challengeProgress: (n, total) => `Evaluando ${n}/${total}…`,
    challengeScoreLabel: 'aciertos',
    challengeErrorsNote: (n) => `${n} ticket(s) sin respuesta: el marcador cuenta solo los que respondieron.`,
    colTicket: 'Ticket',
    colExpected: 'Esperado',
    colJev: 'Jev',
    colConfidence: 'Confianza',
    colResult: 'Resultado',
    badgeOk: 'Acierto',
    badgeFail: 'Falló',
    thresholdLabel: 'Umbral de confianza',
    thresholdAuto: 'Automáticos',
    thresholdReview: 'A revisión humana',
    thresholdWrongAuto: 'Errores que se automatizarían',
    thresholdHelp_plain: 'Arriba del umbral, Jev decide solo; abajo, lo mira una persona.',
    thresholdHelp_tech: 'p ≥ umbral → automático; p < umbral → revisión. Medí la precisión por umbral con tu set.',
    badgeReview: 'A revisión',
    retry: 'Reintentar',
    errRowFailed: 'Jev no respondió este ticket.',
    errAllFailed: 'No se pudo llegar a Jev. Revisá la conexión o que el server tenga la key.',
    errEmptyQuestion: 'Escribí una pregunta para evaluar los tickets.',
    docsIntro: 'Referencia técnica de Jev: modelo, API, tipos, integración y buenas prácticas.',
    docsToc: 'En esta página:',
    copy: 'Copiar',
    copied: '¡Copiado!',
    tryIt: 'Probalo en el playground →',
    intro: 'Jev lee una situación y responde preguntas cerradas con probabilidades. Elegí un ejemplo o escribí el tuyo.',
    step1: '1 · La situación',
    step2: '2 · Las preguntas',
    step3: '3 · Lo que respondió Jev',
    examples: 'Ejemplos:',
    statePlaceholder: 'Escribí acá lo que pasó: un mail, un comentario, una conversación…',
    questionPlaceholder: '¿Qué querés saber?',
    types: { boolean: 'Sí / No', choice: 'Elegir una opción', score: 'Puntaje en escala' },
    hints: {
      boolean: 'Jev dice qué tan probable es que la respuesta sea "sí".',
      choice: 'Jev elige la opción que mejor encaja.',
      score: 'Ordená los niveles de menor a mayor. Jev elige en cuál cae.',
    },
    optionPlaceholder: 'Opción',
    levelPlaceholder: 'Nivel',
    addOption: '+ agregar opción',
    addLevel: '+ agregar nivel',
    addQuestion: '+ Nueva pregunta',
    remove: 'Quitar',
    run: 'Preguntarle a Jev',
    running: 'Pensando…',
    yes: 'Sí', no: 'No',
    sure: (p) => `${p}% de confianza`,
    costFooter: (what, seconds, tokens, usd) => `${what} · ${seconds} s · ${tokens} tokens de entrada · ${usd} estimado`,
    ticketsCount: (n) => `${n} tickets`,
    questionsCount: (n) => (n === 1 ? '1 pregunta' : `${n} preguntas`),
    howToRead: '¿Cómo leer esto?',
    viewJson: 'Ver JSON',
    hideJson: 'Ocultar JSON',
    errNoState: 'Escribí una situación primero.',
    errNoText: 'Falta escribir la pregunta.',
    errOptions: 'Necesita al menos 2 opciones con texto.',
    errNoQuestions: 'Agregá al menos una pregunta.',
    errServer: 'Jev no pudo responder',
    advancedHint: 'Lo que se envía al modelo y la respuesta cruda.',
    presets: {
      support: {
        label: 'Soporte',
        state: 'El cliente mandó tres mails enojado por una entrega demorada. El agente de soporte pidió disculpas y le devolvió todo el dinero.',
        questions: [
          { text: '¿Se hizo un reembolso?', type: 'boolean', options: [] },
          { text: '¿Cuál es el tema principal del ticket?', type: 'choice', options: ['Envío', 'Facturación', 'Producto'] },
          { text: '¿Qué tan enojado está el cliente?', type: 'score', options: ['Tranquilo', 'Molesto', 'Enojado', 'Furioso'] },
        ],
      },
      review: {
        label: 'Reseña',
        state: 'Compré estos auriculares hace un mes. El sonido es excelente, pero la batería dura la mitad de lo que prometen.',
        questions: [
          { text: '¿El cliente recomendaría el producto?', type: 'boolean', options: [] },
          { text: '¿De qué se queja?', type: 'choice', options: ['Sonido', 'Batería', 'Precio', 'Envío'] },
          { text: '¿Cuántas estrellas le daría?', type: 'score', options: ['1 estrella', '2 estrellas', '3 estrellas', '4 estrellas', '5 estrellas'] },
        ],
      },
      email: {
        label: 'Email',
        state: '¡FELICITACIONES! Ganaste un iPhone. Hacé clic acá en las próximas 24 horas para reclamar tu premio: bit.ly/premio-ya',
        questions: [
          { text: '¿Es spam o una estafa?', type: 'boolean', options: [] },
          { text: '¿Qué tipo de mail es?', type: 'choice', options: ['Trabajo', 'Personal', 'Promoción', 'Estafa'] },
          { text: '¿Qué tan urgente parece?', type: 'score', options: ['Nada urgente', 'Poco urgente', 'Urgente', 'Muy urgente'] },
        ],
      },
    },
  },
  en: {
    locale: 'en-US',
    tabPlayground: 'Playground',
    tabDocs: 'Docs',
    tabChallenge: 'Challenge',
    challengeTitle: 'Challenge: 15 support tickets',
    challengeIntro_plain: 'Jev classifies 15 support tickets and we compare its answer with the right one.',
    challengeIntro_tech: 'Evaluation of 1 question over 15 labeled tickets: accuracy, per-case confidence and failures.',
    challengeSuggested: 'Suggested question',
    challengeQuestion: 'Question text (you can reword it)',
    challengeTrapNote: 'TypeSafe says Jev struggles with counting. Measure it.',
    challengeRun: (n) => `Evaluate the ${n} tickets`,
    challengeProgress: (n, total) => `Evaluating ${n}/${total}…`,
    challengeScoreLabel: 'correct',
    challengeErrorsNote: (n) => `${n} ticket(s) without an answer: the score only counts those that answered.`,
    colTicket: 'Ticket',
    colExpected: 'Expected',
    colJev: 'Jev',
    colConfidence: 'Confidence',
    colResult: 'Result',
    badgeOk: 'Correct',
    badgeFail: 'Wrong',
    thresholdLabel: 'Confidence threshold',
    thresholdAuto: 'Automated',
    thresholdReview: 'Human review',
    thresholdWrongAuto: 'Errors that would be automated',
    thresholdHelp_plain: 'Above the threshold Jev decides on its own; below it, a person checks.',
    thresholdHelp_tech: 'p ≥ threshold → automated; p < threshold → review. Measure precision per threshold on your set.',
    badgeReview: 'Review',
    retry: 'Retry',
    errRowFailed: 'Jev did not answer this ticket.',
    errAllFailed: 'Could not reach Jev. Check the connection or that the server has the key.',
    errEmptyQuestion: 'Write a question to evaluate the tickets.',
    docsIntro: 'Technical reference for Jev: model, API, types, integration and best practices.',
    docsToc: 'On this page:',
    copy: 'Copy',
    copied: 'Copied!',
    tryIt: 'Try it in the playground →',
    intro: 'Jev reads a situation and answers closed questions with probabilities. Pick an example or write your own.',
    step1: '1 · The situation',
    step2: '2 · The questions',
    step3: '3 · What Jev answered',
    examples: 'Examples:',
    statePlaceholder: 'Write what happened here: an email, a comment, a conversation…',
    questionPlaceholder: 'What do you want to know?',
    types: { boolean: 'Yes / No', choice: 'Pick one option', score: 'Score on a scale' },
    hints: {
      boolean: 'Jev tells how likely the answer is "yes".',
      choice: 'Jev picks the option that fits best.',
      score: 'Order the levels from lowest to highest. Jev picks where it lands.',
    },
    optionPlaceholder: 'Option',
    levelPlaceholder: 'Level',
    addOption: '+ add option',
    addLevel: '+ add level',
    addQuestion: '+ New question',
    remove: 'Remove',
    run: 'Ask Jev',
    running: 'Thinking…',
    yes: 'Yes', no: 'No',
    sure: (p) => `${p}% confidence`,
    costFooter: (what, seconds, tokens, usd) => `${what} · ${seconds} s · ${tokens} input tokens · ${usd} estimated`,
    ticketsCount: (n) => `${n} tickets`,
    questionsCount: (n) => (n === 1 ? '1 question' : `${n} questions`),
    howToRead: 'How do I read this?',
    viewJson: 'View JSON',
    hideJson: 'Hide JSON',
    errNoState: 'Write a situation first.',
    errNoText: 'The question is missing.',
    errOptions: 'Needs at least 2 options with text.',
    errNoQuestions: 'Add at least one question.',
    errServer: 'Jev could not answer',
    advancedHint: 'What is sent to the model and the raw response.',
    presets: {
      support: {
        label: 'Support',
        state: 'The customer wrote three angry emails about a late delivery. The support agent apologized and issued a full refund.',
        questions: [
          { text: 'Was a refund issued?', type: 'boolean', options: [] },
          { text: 'What is the main topic of the ticket?', type: 'choice', options: ['Shipping', 'Billing', 'Product'] },
          { text: 'How angry is the customer?', type: 'score', options: ['Calm', 'Annoyed', 'Angry', 'Furious'] },
        ],
      },
      review: {
        label: 'Review',
        state: 'I bought these headphones a month ago. The sound is excellent, but the battery lasts half of what they promise.',
        questions: [
          { text: 'Would the customer recommend the product?', type: 'boolean', options: [] },
          { text: 'What are they complaining about?', type: 'choice', options: ['Sound', 'Battery', 'Price', 'Shipping'] },
          { text: 'How many stars would they give?', type: 'score', options: ['1 star', '2 stars', '3 stars', '4 stars', '5 stars'] },
        ],
      },
      email: {
        label: 'Email',
        state: 'CONGRATULATIONS! You won an iPhone. Click here within the next 24 hours to claim your prize: bit.ly/prize-now',
        questions: [
          { text: 'Is it spam or a scam?', type: 'boolean', options: [] },
          { text: 'What kind of email is it?', type: 'choice', options: ['Work', 'Personal', 'Promotion', 'Scam'] },
          { text: 'How urgent does it look?', type: 'score', options: ['Not urgent', 'Slightly urgent', 'Urgent', 'Very urgent'] },
        ],
      },
    },
  },
};

export const SNIPPET = `import { experimental_evaluate as evaluate } from 'ai';

const { answers } = await evaluate({
model: 'typesafe-ai/jev',
state: ticketText,
questions: {
  urgent: { type: 'boolean', instructions: 'Is this ticket urgent?' },
},
});

if (answers.urgent.probability > 0.9) escalate();`;

export const CURL = `curl -s localhost:3000/evaluate \\
-H 'content-type: application/json' \\
-d '{
  "state": { "subject": "Charged twice", "body": "Please refund one." },
  "questions": {
    "team": {
      "type": "choice",
      "instructions": "Which team should handle this ticket?",
      "criteria": { "billing": "Charges, invoices, refunds", "shipping": "Delivery", "tech": "Bugs" }
    }
  }
}'`;

export const TYPES = `type Input = string | JSONObject | JSONValue[];

type Question =
| { type: 'boolean'; instructions: Input; criteria?: { true?: Input | null; false?: Input | null } }
| { type: 'choice'; instructions: Input; criteria: Record<string, Input | null> }
| { type: 'score'; instructions: Input; criteria: (Input | null)[] };

type Answer =
| { type: 'boolean'; probability: number }
| { type: 'choice'; choice: string; probabilities?: Record<string, number> }
| { type: 'score'; score: number; probabilities?: Record<string, number> };`;

export const DOCS = {
  es: [
    {
      id: 'what', title: 'Qué es Jev',
      body: [
        'Modelo de evaluación de TypeSafe AI, disponible en Vercel AI Gateway como typesafe-ai/jev. No genera texto: recibe un state (string, objeto o array JSON) y un mapa de preguntas tipadas, y devuelve un objeto de respuestas tipadas con probabilidades.',
        'En la práctica funciona como un clasificador zero-shot configurable en cada request: definís las etiquetas en la llamada, sin entrenar ni hacer fine-tuning, y obtenés salida estructurada sin JSON mode, sin regex y sin validar el formato.',
      ],
    },
    {
      id: 'vs-llm', title: 'Jev vs. LLMs',
      lead: ['Un LLM genera; Jev decide. Si lo que necesitás es un valor para un if, un switch o una cola, Jev evita parsear texto y pagar tokens de salida que no usás.'],
      table: {
        head: ['', 'Jev', 'LLM'],
        rows: [
          ['Salida', 'Objeto tipado: probability / choice / score + distribución', 'Tokens de texto (parseo o JSON mode)'],
          ['Formato garantizado', 'Sí, por tipo de pregunta', 'Depende del modelo y del prompt'],
          ['Latencia', '< 1 s (0.4–0.9 s medido en este playground)', 'Crece con el largo de la respuesta'],
          ['Precio', 'US$0.042 / M tokens de entrada', 'Bastante más caro por token'],
          ['Contexto', '32k tokens', 'Según el modelo'],
          ['Razonamiento', 'No explica ni encadena pasos', 'Chain-of-thought, tool use'],
        ],
      },
    },
    {
      id: 'system-one', title: 'System One',
      body: [
        'El término viene de Kahneman (Thinking, Fast and Slow): Sistema 1 es pensamiento rápido e intuitivo; Sistema 2, lento y deliberado. TypeSafe ubica a los LLM en el Sistema 2, porque generan y razonan paso a paso, y a Jev en el Sistema 1: decide entre opciones cerradas en vez de generar.',
        'Jev es el primero de sus modelos System One. El nombre viene de la paradoja de Jevons: cuando un recurso se abarata, su consumo total crece. La apuesta es que la inferencia barata termine embebida en cualquier punto de decisión del software.',
      ],
    },
    {
      id: 'types', title: 'Tipos de pregunta',
      code: [TYPES],
      list: [
        'boolean: probability = P(true). criteria.true / criteria.false son opcionales y definen qué cuenta como sí y como no.',
        'choice: criteria es un mapa opción → descripción (o null). choice es la key ganadora y probabilities suma 1.',
        'score: criteria es un array ordenado de 2 o más niveles. score es el índice esperado (0-based), Σ i·p(i).',
        'instructions y criteria aceptan string u objeto JSON.',
      ],
      body: ['Según TypeSafe, las preguntas de una misma llamada se evalúan en paralelo y aisladas entre sí contra el mismo state: una no condiciona a otra.'],
    },
    {
      id: 'integrate', title: 'Integración',
      list: [
        'npm i ai (v7+). La función es experimental_evaluate: es una API experimental y puede cambiar entre versiones.',
        'Auth: AI_GATEWAY_API_KEY en el entorno. En un deploy de Vercel, el SDK usa el token OIDC del proyecto y no hace falta key.',
        'model acepta el id del gateway (typesafe-ai/jev) o una instancia de modelo de evaluación.',
        'Opciones extra: maxRetries, abortSignal, headers, providerOptions.',
      ],
      code: [SNIPPET, CURL],
      body: [
        'El segundo ejemplo llama a POST /evaluate de este playground (server.js), que pasa state y questions a experimental_evaluate y devuelve answers, usage, warnings, modelId y ms.',
        'Sin Vercel, TypeSafe documenta su propia API REST (POST https://api.typesafe.ai/v1/systemone, model jev-latest) con una key de TypeSafe. No está probada en este playground.',
      ],
    },
    {
      id: 'uses', title: 'Casos de uso',
      table: {
        head: ['Bien para', 'Mal para'],
        rows: [
          ['Clasificación e intent detection', 'Generar texto, resúmenes o respuestas'],
          ['Routing a colas, equipos o modelos', 'Conteos y fechas: TypeSafe los marca como límite, pero en el desafío de este playground acertó; medilo con tus casos'],
          ['Triage y priorización', 'Aritmética (límite que documenta TypeSafe, no probado acá)'],
          ['Moderación y guardrails', 'Explicar la decisión'],
          ['Verificación automática (¿el output de otro LLM cumple X?)', 'Decisiones que requieren varios pasos de razonamiento'],
        ],
      },
      body: ['Patrón típico: Jev como primer filtro rápido y barato, y un LLM o una persona solo para los casos de baja confianza.'],
    },
    {
      id: 'cost', title: 'Costo',
      body: [
        'US$0.042 por millón de tokens de entrada (precio publicado en la página del modelo en AI Gateway). Una llamada de este playground con 3 preguntas usa unos 400–500 tokens de entrada, o sea ~US$0.00002.',
        'Cada respuesta trae usage ({ inputTokens, outputTokens, totalTokens }) para medirlo. Según TypeSafe, agrupar preguntas en una sola llamada reduce latencia y costo frente a una llamada por pregunta.',
      ],
    },
    {
      id: 'questions', title: 'Cómo diseñar preguntas',
      list: [
        'Una pregunta = una decisión. Partí las condiciones compuestas en preguntas separadas y combinalas en tu código.',
        'Usá las descripciones de criteria: { billing: "Charges, invoices, refunds" } desambigua mejor que la key sola.',
        'Opciones mutuamente excluyentes: si dos se solapan, la probabilidad se reparte entre ambas.',
        'En score el orden importa: el resultado es un índice, así que los niveles van de menor a mayor.',
        'Las keys de choice vuelven tal cual en la respuesta: usá identificadores estables (billing), no texto de UI.',
      ],
      table: {
        head: ['Mal', 'Bien'],
        rows: [
          ['instructions: "Is the customer angry and asking for a refund?"', 'Dos booleans: angry y refund'],
          ['criteria: { problem, complaint, issue }', 'criteria: { billing: "…", shipping: "…", tech: "…" }'],
          ['criteria: ["high", "low", "medium"]', 'criteria: ["low", "medium", "high"]'],
        ],
      },
    },
    {
      id: 'results', title: 'Interpretar resultados',
      list: [
        'boolean → probability ∈ [0, 1] = P(true).',
        'choice → choice (argmax) + probabilities por opción.',
        'score → índice esperado: { 2: 0.81, 3: 0.19 } da 2.19. Para el nivel más probable, mirá probabilities.',
        'El resultado del SDK trae además usage, warnings y response.modelId, útiles para logging.',
      ],
      body: ['Umbrales: un punto de partida es ≥ 0.9 → automático, 0.5–0.9 → revisión humana o fallback a un LLM, < 0.5 → otra rama. Las probabilidades no vienen garantizadas como calibradas: medí la precisión por umbral con un set etiquetado propio antes de automatizar.'],
    },
    {
      id: 'reference', title: 'Referencia rápida',
      table: {
        head: ['Campo', 'Qué es'],
        rows: [
          ['state', 'string | objeto JSON | array JSON. Input compartido por todas las preguntas.'],
          ['questions', 'Record<id, Question>. Los ids vuelven como keys en answers.'],
          ['instructions', 'La pregunta, como string u objeto JSON.'],
          ['criteria', 'Opciones (choice), niveles (score) o definición de true/false (boolean).'],
          ['answers', 'Record<id, Answer>, tipado según cada pregunta.'],
          ['usage', '{ inputTokens, outputTokens, totalTokens }'],
        ],
      },
      list: [
        'Contexto máximo: 32k tokens por llamada.',
        'Solo texto: sin imágenes ni audio.',
      ],
    },
    {
      id: 'errors', title: 'Errores y seguridad',
      table: {
        head: ['Error', 'Causa / solución'],
        rows: [
          ['AI Gateway authentication failed', 'No hay AI_GATEWAY_API_KEY ni token OIDC. Exportá la key y reiniciá el proceso.'],
          ['requires a valid credit card', 'La cuenta de Vercel necesita una tarjeta cargada para habilitar el gateway.'],
        ],
      },
      list: [
        'La key va solo en el server (variable de entorno o secret manager), nunca en el bundle del cliente ni en el repo.',
        'Un endpoint público que reenvía a Jev es un proxy abierto a tus créditos: poné auth (por ejemplo, Vercel Deployment Protection), rate limiting y un límite de gasto en AI Gateway.',
        'El state puede llevar PII: tratalo como cualquier otro request a un proveedor externo.',
      ],
    },
  ],
  en: [
    {
      id: 'what', title: 'What is Jev',
      body: [
        'An evaluation model from TypeSafe AI, available on Vercel AI Gateway as typesafe-ai/jev. It doesn\'t generate text: it takes a state (string, JSON object or array) and a map of typed questions, and returns an object of typed answers with probabilities.',
        'In practice it works like a zero-shot classifier you configure per request: you define the labels in the call, with no training or fine-tuning, and get structured output without JSON mode, regex or format validation.',
      ],
    },
    {
      id: 'vs-llm', title: 'Jev vs. LLMs',
      lead: ['An LLM generates; Jev decides. If what you need is a value for an if, a switch or a queue, Jev saves you from parsing text and paying for output tokens you don\'t use.'],
      table: {
        head: ['', 'Jev', 'LLM'],
        rows: [
          ['Output', 'Typed object: probability / choice / score + distribution', 'Text tokens (parsing or JSON mode)'],
          ['Guaranteed format', 'Yes, per question type', 'Depends on model and prompt'],
          ['Latency', '< 1 s (0.4–0.9 s measured in this playground)', 'Grows with response length'],
          ['Price', 'US$0.042 / M input tokens', 'Considerably more per token'],
          ['Context', '32k tokens', 'Model-dependent'],
          ['Reasoning', 'Doesn\'t explain or chain steps', 'Chain-of-thought, tool use'],
        ],
      },
    },
    {
      id: 'system-one', title: 'System One',
      body: [
        'The term comes from Kahneman (Thinking, Fast and Slow): System 1 is fast, intuitive thinking; System 2 is slow and deliberate. TypeSafe places LLMs in System 2, since they generate and reason step by step, and Jev in System 1: it decides between closed options instead of generating.',
        'Jev is the first of its System One models. The name comes from the Jevons paradox: when a resource gets cheaper, total consumption grows. The bet is that cheap inference ends up embedded in every decision point of software.',
      ],
    },
    {
      id: 'types', title: 'Question types',
      code: [TYPES],
      list: [
        'boolean: probability = P(true). criteria.true / criteria.false are optional and define what counts as yes and no.',
        'choice: criteria maps option → description (or null). choice is the winning key and probabilities sums to 1.',
        'score: criteria is an ordered array of 2 or more levels. score is the expected (0-based) index, Σ i·p(i).',
        'instructions and criteria accept a string or a JSON object.',
      ],
      body: ['According to TypeSafe, questions in the same call are evaluated in parallel and in isolation against the same state: one doesn\'t influence another.'],
    },
    {
      id: 'integrate', title: 'Integration',
      list: [
        'npm i ai (v7+). The function is experimental_evaluate: it\'s an experimental API and may change between versions.',
        'Auth: AI_GATEWAY_API_KEY in the environment. When deployed on Vercel, the SDK uses the project\'s OIDC token and no key is needed.',
        'model accepts the gateway id (typesafe-ai/jev) or an evaluation model instance.',
        'Extra options: maxRetries, abortSignal, headers, providerOptions.',
      ],
      code: [SNIPPET, CURL],
      body: [
        'The second example calls this playground\'s POST /evaluate (server.js), which passes state and questions to experimental_evaluate and returns answers, usage, warnings, modelId and ms.',
        'Without Vercel, TypeSafe documents its own REST API (POST https://api.typesafe.ai/v1/systemone, model jev-latest) with a TypeSafe key. It is not tested in this playground.',
      ],
    },
    {
      id: 'uses', title: 'Use cases',
      table: {
        head: ['Good for', 'Not good for'],
        rows: [
          ['Classification and intent detection', 'Generating text, summaries or replies'],
          ['Routing to queues, teams or models', 'Counting and dates: TypeSafe lists them as limits, but it got them right in this playground\'s challenge; measure with your own cases'],
          ['Triage and prioritization', 'Arithmetic (a limit TypeSafe documents, not tested here)'],
          ['Moderation and guardrails', 'Explaining the decision'],
          ['Automated verification (does another LLM\'s output meet X?)', 'Decisions that need multi-step reasoning'],
        ],
      },
      body: ['Typical pattern: Jev as a fast, cheap first filter, with an LLM or a human only for low-confidence cases.'],
    },
    {
      id: 'cost', title: 'Cost',
      body: [
        'US$0.042 per million input tokens (price listed on the model page in AI Gateway). A playground call with 3 questions uses about 400–500 input tokens, so ~US$0.00002.',
        'Every response includes usage ({ inputTokens, outputTokens, totalTokens }) to measure it. According to TypeSafe, batching questions in one call reduces latency and cost versus one call per question.',
      ],
    },
    {
      id: 'questions', title: 'Designing questions',
      list: [
        'One question = one decision. Split compound conditions into separate questions and combine them in your code.',
        'Use criteria descriptions: { billing: "Charges, invoices, refunds" } disambiguates better than the key alone.',
        'Mutually exclusive options: if two overlap, the probability gets split between them.',
        'In score, order matters: the result is an index, so levels go from lowest to highest.',
        'choice keys come back as-is in the response: use stable identifiers (billing), not UI copy.',
      ],
      table: {
        head: ['Bad', 'Good'],
        rows: [
          ['instructions: "Is the customer angry and asking for a refund?"', 'Two booleans: angry and refund'],
          ['criteria: { problem, complaint, issue }', 'criteria: { billing: "…", shipping: "…", tech: "…" }'],
          ['criteria: ["high", "low", "medium"]', 'criteria: ["low", "medium", "high"]'],
        ],
      },
    },
    {
      id: 'results', title: 'Reading results',
      list: [
        'boolean → probability ∈ [0, 1] = P(true).',
        'choice → choice (argmax) + per-option probabilities.',
        'score → expected index: { 2: 0.81, 3: 0.19 } gives 2.19. For the most likely level, look at probabilities.',
        'The SDK result also includes usage, warnings and response.modelId, useful for logging.',
      ],
      body: ['Thresholds: a starting point is ≥ 0.9 → automatic, 0.5–0.9 → human review or LLM fallback, < 0.5 → another branch. Probabilities are not guaranteed to be calibrated: measure precision per threshold on your own labeled set before automating.'],
    },
    {
      id: 'reference', title: 'Quick reference',
      table: {
        head: ['Field', 'What it is'],
        rows: [
          ['state', 'string | JSON object | JSON array. Input shared by all questions.'],
          ['questions', 'Record<id, Question>. The ids come back as keys in answers.'],
          ['instructions', 'The question, as a string or JSON object.'],
          ['criteria', 'Options (choice), levels (score) or the true/false definition (boolean).'],
          ['answers', 'Record<id, Answer>, typed per question.'],
          ['usage', '{ inputTokens, outputTokens, totalTokens }'],
        ],
      },
      list: [
        'Max context: 32k tokens per call.',
        'Text only: no images or audio.',
      ],
    },
    {
      id: 'errors', title: 'Errors and security',
      table: {
        head: ['Error', 'Cause / fix'],
        rows: [
          ['AI Gateway authentication failed', 'No AI_GATEWAY_API_KEY or OIDC token. Export the key and restart the process.'],
          ['requires a valid credit card', 'The Vercel account needs a card on file to enable the gateway.'],
        ],
      },
      list: [
        'The key lives only on the server (environment variable or secret manager), never in the client bundle or the repo.',
        'A public endpoint that forwards to Jev is an open proxy to your credits: add auth (e.g. Vercel Deployment Protection), rate limiting and a spend limit in AI Gateway.',
        'The state may contain PII: treat it like any other request to a third-party provider.',
      ],
    },
  ],
};

export const resolve = (lang, table = I18N) => ({ ...table.en, ...(table[lang] ?? {}) });

export const docsFor = (lang) => DOCS[lang] ?? DOCS.en;
