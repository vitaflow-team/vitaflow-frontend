import { describe, expect, it } from 'vitest';
import { DEFAULT_PERIOD, PERIOD_OPTIONS, parsePeriod } from './progressPeriod';

describe('progress dashboard refresh — chart period parsing', () => {
  it('UT-015 accepts the three valid address values', () => {
    expect(parsePeriod('4')).toBe(4);
    expect(parsePeriod('8')).toBe(8);
    expect(parsePeriod('12')).toBe(12);
  });

  it('UT-016 falls back to 8 for every invalid address value, without throwing', () => {
    const invalid: Array<string | string[] | undefined> = [
      undefined,
      '',
      '5',
      'abc',
      '4.0',
      ['4', '8'],
    ];

    for (const value of invalid) {
      expect(() => parsePeriod(value)).not.toThrow();
      expect(parsePeriod(value)).toBe(8);
    }
  });

  it('UT-016 also refuses padded, signed and decimal-comma variants', () => {
    expect(parsePeriod(' 4 ')).toBe(DEFAULT_PERIOD);
    expect(parsePeriod('-4')).toBe(DEFAULT_PERIOD);
    expect(parsePeriod('04')).toBe(DEFAULT_PERIOD);
    expect(parsePeriod('4,0')).toBe(DEFAULT_PERIOD);
    expect(parsePeriod('0')).toBe(DEFAULT_PERIOD);
    expect(parsePeriod([])).toBe(DEFAULT_PERIOD);
  });

  it('exposes 4, 8 and 12 as the offered options with 8 as the default', () => {
    expect(PERIOD_OPTIONS).toEqual([4, 8, 12]);
    expect(DEFAULT_PERIOD).toBe(8);
  });
});
