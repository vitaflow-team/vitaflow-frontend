import { formatDecimal } from './decimalInput';
import { formatRecordDate } from './progressDisplay';

/** Sinal de menos tipográfico (U+2212), não o hífen. */
const MINUS_SIGN = '−';

export function formatLastWeightReference(record: {
  weightKg: number;
  recordedAt: string;
}): string {
  return `Último: ${formatDecimal(record.weightKg)} kg em ${formatRecordDate(
    record.recordedAt
  )}`;
}

/**
 * Diferença em relação ao último peso, sempre em tom neutro (ADR-002). A conta
 * é feita em décimos inteiros para que `0,3 + 0,1 + 82` não vire `-0,0 kg`.
 */
export function formatWeightDelta(
  currentKg: number | undefined,
  lastKg: number
): string | null {
  if (currentKg === undefined || !Number.isFinite(currentKg)) {
    return null;
  }

  const deltaTenths = Math.round(currentKg * 10) - Math.round(lastKg * 10);
  if (deltaTenths === 0) {
    return 'sem alteração';
  }

  const sign = deltaTenths > 0 ? '+' : MINUS_SIGN;

  return `${sign}${formatDecimal(Math.abs(deltaTenths) / 10)} kg`;
}

/** Texto da região viva do peso; vazio quando não há valor a anunciar. */
export function announceWeight(value: string): string {
  if (value.trim() === '') {
    return '';
  }

  return `Peso: ${value} kg`;
}
