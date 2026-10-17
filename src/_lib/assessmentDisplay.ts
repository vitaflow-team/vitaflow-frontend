export const MISSING_VALUE = '—';
export const NO_VARIATION = 'sem variação';

function decimal(value: number): string {
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
}

/** "78,2 kg"; the em dash when the value was not recorded. */
export function formatMeasure(
  value: number | null | undefined,
  unit: string
): string {
  if (value === null || value === undefined) return MISSING_VALUE;

  return unit === '%' ? `${decimal(value)}%` : `${decimal(value)} ${unit}`;
}

/** A signed change: "−0,8 kg", "+1,2 pp", or "sem variação" when it is zero. */
export function formatChange(value: number, unit: string): string {
  if (value === 0) return NO_VARIATION;

  const sign = value > 0 ? '+' : '−';
  return `${sign}${decimal(Math.abs(value))} ${unit}`;
}

/** What removing a student costs, stated in the confirmation. */
export function removalWarning(hasAssessments: boolean): string {
  return hasAssessments
    ? 'O histórico de avaliações físicas e os treinos serão perdidos permanentemente.'
    : 'Este aluno não tem avaliações registradas; os treinos que ele tiver serão perdidos permanentemente.';
}
