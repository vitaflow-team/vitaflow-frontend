import { describe, expect, it } from 'vitest';
import { getTimeTicks, niceTicks } from './chartAxis';

function spacings(ticks: number[]): number[] {
  return ticks
    .slice(1)
    .map((tick, index) => Number((tick - ticks[index]).toFixed(10)));
}

describe('progress dashboard refresh — chart axis helpers', () => {
  it('UT-017 brackets the data with evenly spaced, rounded ticks', () => {
    const { ticks, min, max } = niceTicks(62.9, 66.2);

    expect(ticks.length).toBeGreaterThanOrEqual(4);
    expect(ticks.length).toBeLessThanOrEqual(6);
    expect(ticks[0]).toBeLessThanOrEqual(62.9);
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(66.2);
    expect(min).toBe(ticks[0]);
    expect(max).toBe(ticks[ticks.length - 1]);
    expect(new Set(spacings(ticks)).size).toBe(1);
    for (const tick of ticks) {
      expect(Number((tick / 0.5).toFixed(10)) % 1).toBe(0);
    }
  });

  it('UT-018 keeps a valid axis when every value is equal', () => {
    const { ticks, min, max } = niceTicks(62, 62, 5, 1);

    expect(ticks.every(Number.isFinite)).toBe(true);
    expect(ticks).toContain(62);
    expect(min).toBeLessThan(62);
    expect(max).toBeGreaterThan(62);
    expect(new Set(spacings(ticks)).size).toBe(1);
  });

  it('UT-019 keeps the healthy BMI band inside the axis', () => {
    const { min, max } = niceTicks(Math.min(21.3, 18.5), Math.max(22.4, 24.9));

    expect(min).toBeLessThanOrEqual(18.5);
    expect(max).toBeGreaterThanOrEqual(24.9);
  });

  it('UT-020 produces the exact ticks for a 60,9–68,2 range', () => {
    expect(niceTicks(60.9, 68.2).ticks).toEqual([60, 62.5, 65, 67.5, 70]);
  });

  it('UT-021 keeps four to six evenly spaced ticks across very different ranges', () => {
    const ranges: Array<[number, number]> = [
      [0, 0.5],
      [60, 61],
      [60.9, 68.2],
      [0, 100],
      [15, 45],
    ];

    for (const [min, max] of ranges) {
      const { ticks } = niceTicks(min, max);

      expect(ticks.length).toBeGreaterThanOrEqual(4);
      expect(ticks.length).toBeLessThanOrEqual(6);
      expect(new Set(spacings(ticks)).size).toBe(1);
      expect(ticks[0]).toBeLessThanOrEqual(min);
      expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(max);
    }
  });

  it('UT-022 spreads five time marks evenly across the whole window', () => {
    const start = Date.parse('2026-07-25T12:00:00.000Z');
    const end = Date.parse('2026-09-19T12:00:00.000Z');
    const ticks = getTimeTicks(start, end);
    const fourteenDays = 14 * 24 * 60 * 60 * 1000;

    expect(ticks).toHaveLength(5);
    expect(ticks[0]).toBe(start);
    expect(ticks[4]).toBe(end);
    expect(spacings(ticks)).toEqual([
      fourteenDays,
      fourteenDays,
      fourteenDays,
      fourteenDays,
    ]);
  });

  it('UT-023 handles the degenerate time ranges', () => {
    const start = Date.parse('2026-07-25T12:00:00.000Z');
    const end = Date.parse('2026-09-19T12:00:00.000Z');

    expect(getTimeTicks(start, end, 2)).toEqual([start, end]);
    expect(getTimeTicks(start, start)).toEqual([start]);
    expect(getTimeTicks(end, start)).toEqual([end]);
  });
});
