export const judge = (question, answer, expected, levels = []) => {
  if (question.type === 'boolean') {
    const yes = answer.probability >= 0.5;
    return { answer: yes, confidence: yes ? answer.probability : 1 - answer.probability, ok: yes === expected };
  }
  if (question.type === 'choice') {
    return { answer: answer.choice, confidence: answer.probabilities?.[answer.choice] ?? null, ok: answer.choice === expected };
  }
  const index = Math.min(levels.length - 1, Math.max(0, Math.round(answer.score)));
  return { answer: levels[index], confidence: answer.probabilities?.[index] ?? null, ok: levels[index] === expected };
};

export const scoreRun = (rows) => ({ total: rows.length, correct: rows.filter((r) => r.ok).length });

export const summarize = (rows) => {
  const answered = rows.filter((r) => r.status === 'done');
  return {
    total: rows.length,
    answered: answered.length,
    correct: answered.filter((r) => r.ok).length,
    failed: answered.filter((r) => !r.ok),
    errors: rows.filter((r) => r.status === 'error').length,
  };
};

export const canRun = (instructions) => typeof instructions === 'string' && instructions.trim().length > 0;

export const bucket = (rows, threshold) => {
  const answered = rows.filter((r) => r.status === 'done');
  const auto = answered.filter((r) => (r.confidence ?? 0) >= threshold);
  return { auto: auto.length, review: answered.length - auto.length, wrongAuto: auto.filter((r) => !r.ok).length };
};
