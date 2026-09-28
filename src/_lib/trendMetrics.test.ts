import { describe, expect, it } from 'vitest';
import { formatAxisDate, formatFullDate, TREND_METRICS } from './trendMetrics';

const NOON = Date.parse('2026-09-15T12:00:00.000Z');

describe('refactor — trendMetrics', () => {
  // UT-004
  it('names, colors and formats each metric', () => {
    expect(TREND_METRICS.weight).toMatchObject({
      label: 'Peso',
      unit: 'kg',
      color: 'var(--icon-accent)',
      axisWidth: 44,
    });
    expect(TREND_METRICS.weight.format(82.44)).toBe('82,4');
    expect(TREND_METRICS.weight.format(83)).toBe('83');
    expect(TREND_METRICS.bmi).toMatchObject({
      label: 'IMC',
      unit: '',
      color: 'var(--chart-3)',
    });
    expect(TREND_METRICS.bmi.format(24.1)).toBe('24,1');
  });

  // UT-004
  it('formats axis and full dates in pt-BR', () => {
    expect(formatAxisDate(NOON)).toBe('15/09');
    expect(formatFullDate(NOON)).toMatch(/^15\/09\/2026,? \d{2}:\d{2}$/);
  });
});
