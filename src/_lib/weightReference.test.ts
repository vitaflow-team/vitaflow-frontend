import { describe, expect, it } from 'vitest';
import { formatRecordDate } from './progressDisplay';
import {
  announceWeight,
  formatLastWeightReference,
  formatWeightDelta,
} from './weightReference';

const MINUS_SIGN = '−';

describe('last weight reference', () => {
  it('UT-008 builds the reference line with the Sao Paulo date', () => {
    expect(
      formatLastWeightReference({
        weightKg: 82.4,
        recordedAt: '2026-09-15T15:00:00Z',
      })
    ).toBe('Último: 82,4 kg em 15/09/2026');

    // 02:30 UTC ainda é o dia anterior em Brasília (UTC−3).
    expect(
      formatLastWeightReference({
        weightKg: 82.4,
        recordedAt: '2026-10-01T02:30:00Z',
      })
    ).toBe('Último: 82,4 kg em 30/09/2026');

    expect(formatRecordDate('2026-10-01T02:30:00Z')).toBe('30/09/2026');
    expect(formatRecordDate('2026-10-01T03:30:00Z')).toBe('01/10/2026');
  });

  it('UT-009 formats the difference neutrally with an explicit sign', () => {
    expect(formatWeightDelta(81.8, 82.4)).toBe(`${MINUS_SIGN}0,6 kg`);
    expect(formatWeightDelta(82.7, 82.4)).toBe('+0,3 kg');
    expect(formatWeightDelta(82.4, 82.4)).toBe('sem alteração');
    expect(formatWeightDelta(undefined, 82.4)).toBeNull();
    expect(formatWeightDelta(Number.NaN, 82.4)).toBeNull();
  });

  it('UT-010 computes the difference in exact tenths', () => {
    expect(formatWeightDelta(0.3 + 0.1 + 82, 82.4)).toBe('sem alteração');
    expect(formatWeightDelta(0.1 + 0.2 + 82, 82.4)).toBe(`${MINUS_SIGN}0,1 kg`);
    expect(formatWeightDelta(70.1 + 0.2, 70.1)).toBe('+0,2 kg');
    expect(formatWeightDelta(1.1 * 3 + 79, 82.3)).toBe('sem alteração');

    for (let tenths = 800; tenths <= 850; tenths += 1) {
      const current = tenths / 10;
      const delta = formatWeightDelta(current, 82.4);
      expect(delta).not.toContain('-0,0');
      expect(delta).not.toBe(`${MINUS_SIGN}0,0 kg`);
      expect(delta).not.toBe('+0,0 kg');
    }
  });

  it('UT-013 announces only the settled weight value', () => {
    expect(announceWeight('82,5')).toBe('Peso: 82,5 kg');
    expect(announceWeight('')).toBe('');
    expect(announceWeight('   ')).toBe('');
  });
});
