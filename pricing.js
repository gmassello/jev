export const INPUT_USD_PER_MILLION = 0.042;

export const estimateUsd = (inputTokens) =>
  Number.isFinite(inputTokens) && inputTokens >= 0 ? (inputTokens * INPUT_USD_PER_MILLION) / 1_000_000 : null;

export const formatUsd = (usd, locale = 'en-US') =>
  usd == null ? '—' : `US$${new Intl.NumberFormat(locale, { maximumSignificantDigits: 2 }).format(usd)}`;

export const costParts = ({ ms, inputTokens }, locale = 'en-US') => ({
  seconds: Number.isFinite(ms) ? new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(ms / 1000) : '—',
  tokens: Number.isFinite(inputTokens) ? new Intl.NumberFormat(locale).format(inputTokens) : '—',
  usd: formatUsd(estimateUsd(inputTokens), locale),
});
