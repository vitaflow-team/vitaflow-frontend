import { describe, expect, it } from 'vitest';
import {
  ageInYears,
  formatIsoDay,
  formatMemberSince,
  todayInBrazil,
} from './studentsDates';

describe('students dates', () => {
  it('reads today in Brasília time, not UTC', () => {
    // 01:30 UTC on the 16th is still the 15th at 22:30 in Brasília.
    expect(todayInBrazil(new Date('2026-09-16T01:30:00.000Z'))).toBe(
      '2026-09-15'
    );
    expect(todayInBrazil(new Date('2026-09-16T03:00:00.000Z'))).toBe(
      '2026-09-16'
    );
  });

  it('formats a calendar day without shifting it', () => {
    expect(formatIsoDay('2026-09-15')).toBe('15/09/2026');
    expect(formatIsoDay('not a date')).toBe('not a date');
  });

  it('UT-124 computes the age only when there is a birth date', () => {
    expect(ageInYears('1995-03-10', '2026-03-09')).toBe(30);
    expect(ageInYears('1995-03-10', '2026-03-10')).toBe(31);
    expect(ageInYears(null, '2026-03-10')).toBeNull();
    expect(ageInYears('garbage', '2026-03-10')).toBeNull();
  });

  it('UT-124 states the month and year the student was added', () => {
    expect(formatMemberSince('2026-09-15T15:00:00.000Z')).toBe(
      'setembro de 2026'
    );
  });
});
