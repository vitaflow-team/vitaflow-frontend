const MIN_WEIGHT_TENTHS = 200;
const MAX_WEIGHT_TENTHS = 3000;
const DEFAULT_WEIGHT_KG = 60;

export function normalizeDecimalInput(value: unknown): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return Number.NaN;

  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  if (!/^\d+([.,]\d+)?$/.test(trimmed)) return Number.NaN;

  return Number(trimmed.replace(',', '.'));
}

export function formatDecimal(value: number | undefined): string {
  if (value === undefined) return '';

  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    useGrouping: false,
  });
}

export function stepWeight(
  current: number | undefined,
  direction: 1 | -1,
  fallback?: number
): number {
  const base = Number.isFinite(current)
    ? current!
    : Number.isFinite(fallback)
      ? fallback!
      : DEFAULT_WEIGHT_KG;
  const nextTenths = Math.min(
    MAX_WEIGHT_TENTHS,
    Math.max(MIN_WEIGHT_TENTHS, Math.round(base * 10) + direction)
  );

  return nextTenths / 10;
}
