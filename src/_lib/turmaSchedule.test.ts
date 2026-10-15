import { describe, expect, it } from 'vitest';
import {
  minutesToTime,
  timeToMinutes,
  WEEKDAY_LABELS,
  WEEKDAYS,
} from './turmaSchedule';

describe('turma schedule time conversion', () => {
  it('converts minutes to an HH:MM time string', () => {
    expect(minutesToTime(0)).toBe('00:00');
    expect(minutesToTime(600)).toBe('10:00');
    expect(minutesToTime(1435)).toBe('23:55');
  });

  it('converts an HH:MM time string back to minutes', () => {
    expect(timeToMinutes('00:00')).toBe(0);
    expect(timeToMinutes('10:00')).toBe(600);
    expect(timeToMinutes('23:55')).toBe(1435);
  });

  it("round-trips every weekday's label", () => {
    expect(WEEKDAYS).toHaveLength(7);
    for (const weekday of WEEKDAYS) {
      expect(WEEKDAY_LABELS[weekday]).toBeTruthy();
    }
  });
});
