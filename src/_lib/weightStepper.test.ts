import { describe, expect, it } from 'vitest';
import { stepWeight } from './decimalInput';
import {
  canStepWeight,
  HOLD_DELAY_MS,
  repeatIntervalMs,
} from './weightStepper';

/**
 * Reproduz, só com a agenda pura, quantos passos uma pressão de `holdMs`
 * produziria. Ponteiro e timers de verdade são verificados no navegador.
 */
function simulateHold(holdMs: number): number[] {
  const steps = [0];
  let elapsed = HOLD_DELAY_MS;
  let repeatCount = 0;

  while (elapsed <= holdMs) {
    steps.push(elapsed);
    elapsed += repeatIntervalMs(repeatCount);
    repeatCount += 1;
  }

  return steps;
}

describe('weight stepper', () => {
  it('UT-006 respects the existing weight limits and steps without drift', () => {
    expect(canStepWeight(20, -1)).toBe(false);
    expect(canStepWeight(20, 1)).toBe(true);
    expect(canStepWeight(300, 1)).toBe(false);
    expect(canStepWeight(300, -1)).toBe(true);
    expect(canStepWeight(undefined, 1)).toBe(true);
    expect(canStepWeight(undefined, -1)).toBe(true);
    expect(canStepWeight(Number.NaN, 1)).toBe(true);

    expect(stepWeight(82.4, 1)).toBe(82.5);
    expect(stepWeight(82.4, -1)).toBe(82.3);

    let value = 60;
    for (let index = 0; index < 100; index += 1) {
      value = stepWeight(value, 1);
    }
    expect(value).toBe(70);
  });

  it('UT-007 starts repeating after the hold delay and only accelerates', () => {
    expect(HOLD_DELAY_MS).toBe(500);

    expect(repeatIntervalMs(0)).toBe(150);
    expect(repeatIntervalMs(9)).toBe(150);
    expect(repeatIntervalMs(10)).toBe(100);
    expect(repeatIntervalMs(30)).toBe(60);

    let previous = repeatIntervalMs(0);
    for (let count = 1; count <= 200; count += 1) {
      const current = repeatIntervalMs(count);
      expect(current).toBeLessThanOrEqual(previous);
      previous = current;
    }

    // Toque curto: um único passo, nada agendado além do timer de atraso.
    expect(simulateHold(200)).toEqual([0]);
    expect(simulateHold(HOLD_DELAY_MS - 1)).toEqual([0]);

    const held = simulateHold(3000);
    expect(held.length).toBeGreaterThan(20);
    expect(held[1]).toBe(HOLD_DELAY_MS);
    const firstGap = held[2] - held[1];
    const lastGap = held[held.length - 1] - held[held.length - 2];
    expect(firstGap).toBe(150);
    expect(lastGap).toBeLessThan(firstGap);
  });
});
