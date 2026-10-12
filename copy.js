export const I18N = {
  es: {
    step1: 'El texto',
    step2: 'La pregunta',
    step3: 'La respuesta de Jev',
    stepOf: (n, total) => `Paso ${n} de ${total}`,
    copy: 'Copiar',
    copied: '¡Copiado!',
    next: 'Siguiente paso →',
    prev: '← Anterior',
    home: '⇤ Inicio',
    start: 'Empezar →',
    descriptionPlaceholder: 'Descripción',
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
    remove: 'Quitar',
    run: 'Preguntarle a Jev',
    running: 'Pensando…',
    yes: 'Sí', no: 'No',
    sure: (p) => `${p}% de confianza`,
    explain: {
      boolean: (yes, p) => `Jev está ${p}% seguro de que ${yes ? 'sí' : 'no'}. Arriba de 90% podrías automatizar; abajo, que lo mire una persona.`,
      choice: (option, p) => `Eligió «${option}» con ${p}%. Las barras muestran cómo repartió la probabilidad entre las opciones.`,
      score: (level, n, total) => `Lo ubicó en «${level}» (nivel ${n} de ${total}). Las barras muestran qué tan seguro está de cada nivel.`,
    },
    thresholdNote: (p, auto, limit) => `Confianza ${p}%: con un umbral de ${limit}%, ${auto ? 'se automatizaría' : 'este ticket iría a revisión humana'}.`,
    multiOutro: 'Con estas tres respuestas podrías rutear el ticket, priorizarlo y marcar el reembolso en un solo paso.',
    jsonToggle: 'Ver el JSON de la llamada',
    jsonRequest: 'Lo que le mandamos a Jev',
    jsonResponse: 'Lo que respondió Jev',
    errNoState: 'Escribí una situación primero.',
    errNoText: 'Falta escribir la pregunta.',
    errOptions: 'Necesita al menos 2 opciones con texto.',
    errServer: 'Jev no pudo responder',
    lessons: [
      {
        id: 'what', kind: 'theory', title: '¿Qué es Jev?',
        theory: [
          'Jev es un modelo que evalúa, no que conversa. Le das un texto y una pregunta cerrada, y te devuelve una respuesta con su probabilidad.',
          'Jev contesta siempre en un formato fijo: un sí o no, una opción de una lista o un nivel de una escala, con un número que dice qué tan seguro está.',
        ],
      },
      {
        id: 'boolean', kind: 'ask', title: 'Sí / No',
        theory: [
          'La pregunta más simple: algo que se responde con sí o no.',
          'Jev devuelve una probabilidad de 0 a 1 de que la respuesta sea "sí". 0,98 quiere decir "casi seguro que sí"; 0,5, "no sé".',
          'En tu código elegís un umbral: por encima, el sistema actúa solo; por debajo, que lo revise una persona.',
        ],
        state: 'El cliente mandó tres mails enojado por una entrega demorada. El agente de soporte pidió disculpas y le devolvió todo el dinero.',
        question: { type: 'boolean', text: '¿Se le devolvió la plata al cliente?', options: [] },
      },
      {
        id: 'choice', kind: 'ask', title: 'Elegir una opción',
        theory: [
          'Ahora la respuesta es una opción de una lista que definís vos.',
          'Jev elige la que mejor encaja y reparte la probabilidad entre todas: el reparto suma 100%.',
          'Conviene que las opciones no se pisen entre sí; si dos significan casi lo mismo, Jev duda entre las dos.',
        ],
        state: '¡FELICITACIONES! Ganaste un iPhone. Hacé clic acá en las próximas 24 horas para reclamar tu premio: bit.ly/premio-ya',
        question: { type: 'choice', text: '¿Qué tipo de mail es?', options: ['Trabajo', 'Personal', 'Promoción', 'Estafa'] },
      },
      {
        id: 'score', kind: 'ask', title: 'Escala',
        theory: [
          'Cuando la respuesta es un grado (poco, algo, mucho), usás una escala.',
          'Los niveles van ordenados de menor a mayor. Jev devuelve la probabilidad de cada nivel y un score: la posición promedio, contando desde 0.',
          'Un score de 3,2 en una escala de 5 niveles cae cerca del cuarto nivel.',
        ],
        state: 'Compré estos auriculares hace un mes. El sonido es excelente, pero la batería dura la mitad de lo que prometen.',
        question: { type: 'score', text: '¿Cuántas estrellas le daría?', options: ['1 estrella', '2 estrellas', '3 estrellas', '4 estrellas', '5 estrellas'] },
      },
      {
        id: 'criteria', kind: 'ask', title: 'Opciones con definición',
        theory: [
          'Un nombre de opción suelto puede ser ambiguo: ¿un reintegro es de "facturación" o de "envíos"?',
          'Podés acompañar cada opción con una descripción corta que le dice a Jev qué entra en ella. Viaja en el campo criteria del request.',
          'Es la forma que conviene para rutear tickets a un equipo.',
        ],
        state: 'Hace dos días que no puedo entrar a mi cuenta: me dice que la contraseña es incorrecta aunque ya la cambié.',
        question: {
          type: 'choice', text: '¿A qué área va este ticket?',
          options: ['facturacion', 'envios', 'tecnica', 'cuenta'],
          descriptions: ['Cobros, facturas, reintegros y cargos en la tarjeta', 'Entregas, demoras y paquetes dañados o perdidos', 'Errores de la web o de la app', 'Acceso, seguridad y datos de la cuenta'],
        },
      },
      {
        id: 'multi', kind: 'multi', title: 'Todo junto',
        theory: [
          'En una sola llamada podés hacer varias preguntas sobre el mismo texto. Cada una se evalúa por separado y vuelve con su id.',
          'Así un mismo ticket se clasifica, se prioriza y se marca en un solo paso.',
        ],
        state: 'Me cobraron dos veces la suscripción y nadie me responde hace una semana. Quiero que me devuelvan la plata ya.',
        questions: [
          { id: 'reembolso', type: 'boolean', text: '¿Pide que le devuelvan plata?', options: [] },
          { id: 'area', type: 'choice', text: '¿A qué área va este ticket?', options: ['facturacion', 'envios', 'tecnica'] },
          { id: 'urgencia', type: 'score', text: '¿Qué tan urgente es?', options: ['baja', 'media', 'alta'] },
        ],
      },
      {
        id: 'doubt', kind: 'ask', title: 'Cuando Jev duda', threshold: 0.9,
        theory: [
          'No todas las respuestas valen lo mismo. Con un texto ambiguo, Jev reparte la probabilidad entre varias opciones y la confianza baja.',
          'Este ticket habla de un pago, de un pedido y de un error de la app a la vez. Mirá cómo se reparten las barras.',
          'Ese número es el que usás para decidir qué automatizar y qué tiene que ver una persona.',
        ],
        state: 'La app me tiró error al pagar y no sé si me cobraron. ¿Me llegó el pedido o no?',
        question: { type: 'choice', text: '¿A qué área va este ticket?', options: ['facturacion', 'envios', 'tecnica'] },
      },
      {
        id: 'when', kind: 'theory', title: 'Cuándo usar Jev y cuándo no',
        theory: ['Jev contesta preguntas cerradas. Si lo que necesitás es una decisión entre opciones conocidas, encaja; si necesitás texto o datos nuevos, no.'],
        table: {
          head: ['Sirve para', 'Mejor otra cosa'],
          rows: [
            ['Rutear tickets a un área', null, 'Redactar la respuesta al cliente (un LLM)'],
            ['Moderar contenido', null, 'Extraer campos a un JSON (un LLM con salida estructurada)'],
            ['Evaluar si un LLM inventó datos', null, 'Cálculos exactos (código)'],
            ['Priorizar por urgencia', null, 'Decidir solo, sin umbral ni revisión humana'],
          ],
        },
        outro: 'Si la salida es una decisión cerrada, Jev. Si es texto libre, un LLM. Si es una regla fija, código.',
      },
      {
        id: 'similar', kind: 'theory', title: 'Proyectos parecidos',
        theory: ['Jev no es el único. Estos proyectos resuelven el mismo problema, o una parte.'],
        table: {
          head: ['Proyecto', 'Qué hace', 'En qué se diferencia de Jev'],
          rows: [
            ['Cloudflare Clef', 'https://blog.cloudflare.com/clef-decision-models/', 'Modelos de decisión con los mismos tipos de pregunta y probabilidades.', 'Código abierto, se puede autohospedar, acepta imágenes y tiene más contexto.'],
            ['AWS Strands Decider 2B', 'https://strandsagents.com/blog/introducing-strands-decider', 'Modelo de decisión abierto: elige opciones, responde sí/no y puntúa con una confianza.', 'Corre local en CPU o GPU, sin API hosteada, y se puede reentrenar con tus datos.'],
            ['Galileo Luna', 'https://galileo.ai/research', 'Modelos chicos para evaluar salidas de LLM: alucinaciones y métricas de calidad.', 'Métricas fijas o entrenadas, no preguntas libres.'],
            ['Jina Classifier', 'https://jina.ai/news/jina-classifier-for-high-performance-zero-shot-and-few-shot-classification', 'API zero-shot: le pasás etiquetas y devuelve una con un score.', 'Solo elegir una etiqueta; no tiene sí/no ni escalas.'],
            ['Hugging Face zero-shot', 'https://huggingface.co/docs/inference-providers/tasks/zero-shot-classification', 'Modelos abiertos como bart-large-mnli: texto y etiquetas, un score por etiqueta.', 'Se puede correr local, pero rinde menos con instrucciones complejas.'],
            ['OpenAI Moderation', 'https://developers.openai.com/api/docs/guides/moderation', 'Gratis: un score de 0 a 1 por categoría de contenido dañino.', 'Categorías fijas: solo sirve para moderar.'],
            ['LLM con salida estructurada', null, 'Un modelo general responde en JSON siguiendo un schema.', 'Genera texto aunque lo encorsetes, y la confianza no viene como dato.'],
          ],
        },
        outro: 'Los más parecidos son Clef, de Cloudflare (compatible con la API de Jev y de código abierto), y Strands Decider, de AWS (abierto y pensado para correr local). Los demás sirven si tu caso es de un solo tipo, como moderación o etiquetas fijas. En cualquier caso, compará con tus propios datos antes de elegir.',
      },
      {
        id: 'glossary', kind: 'theory', title: 'Conceptos',
        theory: ['Un repaso de las palabras que aparecieron en la lección.'],
        table: {
          head: ['Concepto', 'Qué es'],
          rows: [
            ['state', null, 'El texto (o JSON) que Jev lee.'],
            ['question', null, 'Lo que le preguntás, con su tipo: boolean, choice o score.'],
            ['boolean', null, 'Pregunta de sí o no. Devuelve la probabilidad de que sea sí.'],
            ['choice', null, 'Elegir una opción de una lista. Devuelve la elegida y la probabilidad de cada una.'],
            ['score', null, 'Elegir un nivel de una escala ordenada. Devuelve la posición promedio, contando desde 0.'],
            ['criteria', null, 'Qué significa cada respuesta posible. Cambia según el tipo de pregunta.'],
            ['Opciones', null, 'En choice: la lista de respuestas posibles, cada una con una descripción opcional.'],
            ['Niveles', null, 'En score: los escalones de la escala, de menor a mayor, cada uno con su descripción.'],
            ['Sí y no', null, 'En boolean: la definición de qué cuenta como sí y qué cuenta como no.'],
            ['Probabilidad', null, 'De 0 a 1, qué tan probable es una respuesta.'],
            ['Confianza', null, 'La probabilidad de la respuesta que eligió Jev.'],
            ['Umbral', null, 'La confianza mínima para que tu sistema actúe solo; por debajo, revisa una persona.'],
            ['Varias preguntas', null, 'Se mandan en una sola llamada, cada una con su id, y vuelve una respuesta por id.'],
            ['usage', null, 'Los tokens que leyó Jev en la llamada; el costo se calcula sobre los de entrada.'],
          ],
        },
      },
      {
        id: 'code', kind: 'code', title: 'Llevalo a tu código',
        theory: [
          'Todo lo que hiciste en el playground es una llamada a experimental_evaluate del AI SDK.',
          'Este archivo junta lo visto: una pregunta con opciones definidas y el umbral para decidir qué automatizar. Guardalo como jev.mjs y corré estos comandos:',
        ],
        commands: ['npm i ai@7.0.113', 'export AI_GATEWAY_API_KEY=...', 'node jev.mjs'],
        code: `import { experimental_evaluate as evaluate } from 'ai';

const { answers } = await evaluate({
  model: 'typesafe-ai/jev',
  state: 'No puedo entrar a mi cuenta desde ayer: me dice que la contraseña es incorrecta.',
  questions: {
    area: {
      type: 'choice',
      instructions: '¿A qué área va este ticket?',
      criteria: {
        facturacion: 'Cobros, facturas y reintegros',
        tecnica: 'Errores de la web o de la app',
        cuenta: 'Acceso, seguridad y datos de la cuenta',
      },
    },
  },
});

const { choice, probabilities } = answers.area;
if (probabilities[choice] >= 0.9) console.log('Rutear a', choice);
else console.log('A revisión humana:', probabilities);
`,
        outro: 'Cambiá el texto, las opciones o el umbral, y ya tenés tu primer router con Jev.',
      },
    ],
  },
  en: {
    step1: 'The text',
    step2: 'The question',
    step3: 'What Jev answered',
    stepOf: (n, total) => `Step ${n} of ${total}`,
    copy: 'Copy',
    copied: 'Copied!',
    next: 'Next step →',
    prev: '← Back',
    home: '⇤ Start',
    start: 'Start →',
    descriptionPlaceholder: 'Description',
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
    remove: 'Remove',
    run: 'Ask Jev',
    running: 'Thinking…',
    yes: 'Yes', no: 'No',
    sure: (p) => `${p}% confidence`,
    explain: {
      boolean: (yes, p) => `Jev is ${p}% sure the answer is ${yes ? 'yes' : 'no'}. Above 90% you could automate; below, have a person look at it.`,
      choice: (option, p) => `It picked “${option}” with ${p}%. The bars show how it split the probability across the options.`,
      score: (level, n, total) => `It placed it at “${level}” (level ${n} of ${total}). The bars show how sure it is of each level.`,
    },
    thresholdNote: (p, auto, limit) => `Confidence ${p}%: with a ${limit}% threshold, ${auto ? 'this would be automated' : 'this ticket would go to human review'}.`,
    multiOutro: 'With these three answers you could route the ticket, prioritize it and flag the refund in a single step.',
    jsonToggle: 'Show the call JSON',
    jsonRequest: 'What we sent to Jev',
    jsonResponse: 'What Jev answered',
    errNoState: 'Write a situation first.',
    errNoText: 'The question is missing.',
    errOptions: 'Needs at least 2 options with text.',
    errServer: 'Jev could not answer',
    lessons: [
      {
        id: 'what', kind: 'theory', title: 'What is Jev?',
        theory: [
          'Jev is a model that evaluates, it does not chat. You give it a text and a closed question, and it returns an answer with its probability.',
          'Jev always answers in a fixed format: a yes or no, an option from a list or a level on a scale, with a number that says how sure it is.',
        ],
      },
      {
        id: 'boolean', kind: 'ask', title: 'Yes / No',
        theory: [
          'The simplest question: something answered with yes or no.',
          'Jev returns a probability from 0 to 1 that the answer is "yes". 0.98 means "almost certainly yes"; 0.5 means "I don\'t know".',
          'In your code you pick a threshold: above it, the system acts on its own; below it, a person reviews it.',
        ],
        state: 'The customer wrote three angry emails about a late delivery. The support agent apologized and issued a full refund.',
        question: { type: 'boolean', text: 'Did the customer get their money back?', options: [] },
      },
      {
        id: 'choice', kind: 'ask', title: 'Pick one option',
        theory: [
          'Now the answer is one option from a list you define.',
          'Jev picks the one that fits best and splits the probability across all of them: the split adds up to 100%.',
          'Keep the options from overlapping; if two mean almost the same, Jev hesitates between them.',
        ],
        state: 'CONGRATULATIONS! You won an iPhone. Click here within the next 24 hours to claim your prize: bit.ly/prize-now',
        question: { type: 'choice', text: 'What kind of email is it?', options: ['Work', 'Personal', 'Promotion', 'Scam'] },
      },
      {
        id: 'score', kind: 'ask', title: 'Scale',
        theory: [
          'When the answer is a degree (a little, some, a lot), you use a scale.',
          'Levels go from lowest to highest. Jev returns the probability of each level and a score: the average position, counting from 0.',
          'A score of 3.2 on a 5-level scale lands near the fourth level.',
        ],
        state: 'I bought these headphones a month ago. The sound is excellent, but the battery lasts half of what they promise.',
        question: { type: 'score', text: 'How many stars would they give?', options: ['1 star', '2 stars', '3 stars', '4 stars', '5 stars'] },
      },
      {
        id: 'criteria', kind: 'ask', title: 'Options with a definition',
        theory: [
          'A bare option name can be ambiguous: is a refund "billing" or "shipping"?',
          'You can add a short description to each option that tells Jev what belongs in it. It travels in the criteria field of the request.',
          'It is the shape that works for routing tickets to a team.',
        ],
        state: 'For two days I have not been able to log into my account: it says the password is wrong even though I already changed it.',
        question: {
          type: 'choice', text: 'Which team does this ticket go to?',
          options: ['billing', 'shipping', 'tech', 'account'],
          descriptions: ['Charges, invoices, refunds and card payments', 'Deliveries, delays and damaged or lost packages', 'Website or app errors', 'Access, security and account data'],
        },
      },
      {
        id: 'multi', kind: 'multi', title: 'All together',
        theory: [
          'In a single call you can ask several questions about the same text. Each one is evaluated on its own and comes back under its id.',
          'That way one ticket gets classified, prioritized and flagged in a single step.',
        ],
        state: 'I was charged twice for the subscription and nobody has answered me for a week. I want my money back now.',
        questions: [
          { id: 'refund', type: 'boolean', text: 'Are they asking for their money back?', options: [] },
          { id: 'team', type: 'choice', text: 'Which team does this ticket go to?', options: ['billing', 'shipping', 'tech'] },
          { id: 'urgency', type: 'score', text: 'How urgent is it?', options: ['low', 'medium', 'high'] },
        ],
      },
      {
        id: 'doubt', kind: 'ask', title: 'When Jev hesitates', threshold: 0.9,
        theory: [
          'Not every answer is worth the same. With an ambiguous text, Jev splits the probability across several options and its confidence drops.',
          'This ticket is about a payment, an order and an app error at the same time. Watch how the bars split.',
          'That number is what you use to decide what to automate and what a person should look at.',
        ],
        state: 'The app showed an error at checkout. Was I charged? Is my order on its way or not?',
        question: { type: 'choice', text: 'Which team does this ticket go to?', options: ['billing', 'shipping', 'tech'] },
      },
      {
        id: 'when', kind: 'theory', title: 'When to use Jev and when not',
        theory: ['Jev answers closed questions. If you need a decision between known options, it fits; if you need new text or data, it does not.'],
        table: {
          head: ['Good for', 'Better with something else'],
          rows: [
            ['Routing tickets to a team', null, 'Writing the reply to the customer (an LLM)'],
            ['Moderating content', null, 'Extracting fields into JSON (an LLM with structured output)'],
            ['Checking whether an LLM made things up', null, 'Exact calculations (code)'],
            ['Prioritizing by urgency', null, 'Deciding alone, with no threshold or human review'],
          ],
        },
        outro: 'If the output is a closed decision, Jev. If it is free text, an LLM. If it is a fixed rule, code.',
      },
      {
        id: 'similar', kind: 'theory', title: 'Similar projects',
        theory: ['Jev is not alone. These projects solve the same problem, or part of it.'],
        table: {
          head: ['Project', 'What it does', 'How it differs from Jev'],
          rows: [
            ['Cloudflare Clef', 'https://blog.cloudflare.com/clef-decision-models/', 'Decision models with the same question types and probabilities.', 'Open source, self-hostable, accepts images and has a longer context.'],
            ['AWS Strands Decider 2B', 'https://strandsagents.com/blog/introducing-strands-decider', 'Open decision model: picks options, answers yes/no and scores, with a confidence.', 'Runs locally on CPU or GPU, with no hosted API, and can be retrained on your data.'],
            ['Galileo Luna', 'https://galileo.ai/research', 'Small models to evaluate LLM outputs: hallucinations and quality metrics.', 'Fixed or trained metrics, not free-form questions.'],
            ['Jina Classifier', 'https://jina.ai/news/jina-classifier-for-high-performance-zero-shot-and-few-shot-classification', 'Zero-shot API: you pass labels and it returns one with a score.', 'Only picks a label; no yes/no or scales.'],
            ['Hugging Face zero-shot', 'https://huggingface.co/docs/inference-providers/tasks/zero-shot-classification', 'Open models like bart-large-mnli: text and labels in, a score per label out.', 'Runs locally, but handles complex instructions less well.'],
            ['OpenAI Moderation', 'https://developers.openai.com/api/docs/guides/moderation', 'Free: a 0 to 1 score per category of harmful content.', 'Fixed categories: only useful for moderation.'],
            ['LLM with structured output', null, 'A general model answers in JSON following a schema.', 'It still generates text, and confidence does not come back as data.'],
          ],
        },
        outro: 'The closest ones are Cloudflare Clef (Jev-API compatible and open source) and AWS Strands Decider (open and built to run locally). The others work if your case is a single kind, like moderation or fixed labels. Either way, compare them on your own data before choosing.',
      },
      {
        id: 'glossary', kind: 'theory', title: 'Concepts',
        theory: ['A recap of the words that showed up in the lesson.'],
        table: {
          head: ['Concept', 'What it is'],
          rows: [
            ['state', null, 'The text (or JSON) that Jev reads.'],
            ['question', null, 'What you ask, with its type: boolean, choice or score.'],
            ['boolean', null, 'A yes or no question. Returns the probability that the answer is yes.'],
            ['choice', null, 'Pick one option from a list. Returns the chosen one and the probability of each.'],
            ['score', null, 'Pick a level on an ordered scale. Returns the average position, counting from 0.'],
            ['criteria', null, 'What each possible answer means. It changes with the question type.'],
            ['Options', null, 'In choice: the list of possible answers, each with an optional description.'],
            ['Levels', null, 'In score: the steps of the scale, from lowest to highest, each with its description.'],
            ['Yes and no', null, 'In boolean: the definition of what counts as yes and what counts as no.'],
            ['Probability', null, 'From 0 to 1, how likely an answer is.'],
            ['Confidence', null, 'The probability of the answer Jev picked.'],
            ['Threshold', null, 'The minimum confidence for your system to act on its own; below it, a person reviews.'],
            ['Several questions', null, 'Sent in a single call, each with its id, and one answer comes back per id.'],
            ['usage', null, 'The tokens Jev read in the call; cost is computed on the input ones.'],
          ],
        },
      },
      {
        id: 'code', kind: 'code', title: 'Take it to your code',
        theory: [
          'Everything you did in the playground is a call to experimental_evaluate from the AI SDK.',
          'This file puts it together: a question with defined options and the threshold that decides what to automate. Save it as jev.mjs and run these commands:',
        ],
        commands: ['npm i ai@7.0.113', 'export AI_GATEWAY_API_KEY=...', 'node jev.mjs'],
        code: `import { experimental_evaluate as evaluate } from 'ai';

const { answers } = await evaluate({
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
if (probabilities[choice] >= 0.9) console.log('Route to', choice);
else console.log('Send to human review:', probabilities);
`,
        outro: 'Change the text, the options or the threshold, and you have your first router with Jev.',
      },
    ],
  },
};

export const resolve = (lang, table = I18N) => ({ ...table.en, ...(table[lang] ?? {}) });
