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
