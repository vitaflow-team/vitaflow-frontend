import type { AssessmentVariation } from '@/_types/students';

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

/** The variation as short phrases, leaving out what cannot be computed. */
export function describeVariation(variation: AssessmentVariation): string[] {
  const phrases = [`Peso: ${formatChange(variation.weightKg, 'kg')}`];
  if (variation.bodyFatPoints !== null) {
    phrases.push(
      `Gordura corporal: ${formatChange(variation.bodyFatPoints, 'pp')}`
    );
  }

  return phrases;
}

/** What removing a student costs, stated in the confirmation. */
export function removalWarning(hasAssessments: boolean): string {
  return hasAssessments
    ? 'O histórico de avaliações físicas será perdido permanentemente.'
    : 'Este aluno não tem avaliações registradas, então não há histórico a perder.';
}
