export const INPUT_USD_PER_MILLION = 0.042;

export const estimateUsd = (inputTokens) =>
  Number.isFinite(inputTokens) && inputTokens >= 0 ? (inputTokens * INPUT_USD_PER_MILLION) / 1_000_000 : null;

export const formatUsd = (usd, locale = 'en-US') =>
  usd == null ? '—' : `US$${new Intl.NumberFormat(locale, { maximumSignificantDigits: 2 }).format(usd)}`;
