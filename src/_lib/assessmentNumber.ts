const MAX_TYPED_LENGTH = 12;
const TYPED_NUMBER = /^-?\d+([.,]\d+)?$/;

/**
 * Parses a typed measurement: decimal comma or dot, optional minus sign.
 * Empty text is "not provided" (`undefined`); anything else that is not a
 * plain number — thousands separators, exponents, huge strings — is `NaN`,
 * never coerced into a value.
 */
export function parseAssessmentNumber(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return Number.NaN;

  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  if (trimmed.length > MAX_TYPED_LENGTH || !TYPED_NUMBER.test(trimmed)) {
    return Number.NaN;
  }

  return Number(trimmed.replace(',', '.'));
}

/** A saved value as text for an input: decimal comma, empty when absent. */
export function formatAssessmentNumber(
  value: number | null | undefined
): string {
  if (value === null || value === undefined) return '';

  return String(value).replace('.', ',');
}
