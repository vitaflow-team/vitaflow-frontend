const MIN_WEIGHT_TENTHS = 200;
const MAX_WEIGHT_TENTHS = 3000;

/** Tempo de pressão antes de o passo começar a repetir. */
export const HOLD_DELAY_MS = 500;

const REPEAT_STAGES: Array<{ fromRepeat: number; intervalMs: number }> = [
  { fromRepeat: 30, intervalMs: 60 },
  { fromRepeat: 10, intervalMs: 100 },
  { fromRepeat: 0, intervalMs: 150 },
];

/**
 * Intervalo entre repetições, em estágios que só aceleram. É puro para poder
 * ser testado em node — o ciclo de vida de ponteiro e timers fica no hook.
 */
export function repeatIntervalMs(repeatCount: number): number {
  const count = Math.max(0, repeatCount);
  const stage = REPEAT_STAGES.find(item => count >= item.fromRepeat);

  return stage ? stage.intervalMs : 150;
}

/**
 * Se ainda há espaço para um passo na direção pedida. Um campo vazio pode
 * sempre ser incrementado: `stepWeight` parte do seu próprio padrão.
 */
export function canStepWeight(
  currentKg: number | undefined,
  direction: 1 | -1
): boolean {
  if (currentKg === undefined || !Number.isFinite(currentKg)) {
    return true;
  }

  const tenths = Math.round(currentKg * 10);

  return direction === 1
    ? tenths < MAX_WEIGHT_TENTHS
    : tenths > MIN_WEIGHT_TENTHS;
}
