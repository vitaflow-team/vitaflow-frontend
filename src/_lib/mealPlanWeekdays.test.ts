import { describe, expect, it } from 'vitest';
import type { MealPlanDay } from '@/_types/mealPlan';
import { WEEKDAY_ORDER, fullWeek, hasContent } from './mealPlanWeekdays';

function day(overrides: Partial<MealPlanDay> = {}): MealPlanDay {
  return {
    id: 'day-1',
    weekday: 'MONDAY',
    meals: [{ id: 'meal-1', label: 'Almoço', text: 'Arroz e feijão' }],
    ...overrides,
  };
}

describe('fullWeek', () => {
  it('returns all seven weekdays in order, even with no saved days (US-012)', () => {
    const week = fullWeek([]);
    expect(week.map(entry => entry.weekday)).toEqual(WEEKDAY_ORDER);
    expect(week.every(entry => entry.day === null)).toBe(true);
  });

  it('fills in the matching weekday for a saved day', () => {
    const week = fullWeek([day({ weekday: 'WEDNESDAY' })]);
    const wednesday = week.find(entry => entry.weekday === 'WEDNESDAY');
    expect(wednesday?.day?.id).toBe('day-1');
  });
});

describe('hasContent', () => {
  it('is false for a null day or one with no meals', () => {
    expect(hasContent(null)).toBe(false);
    expect(hasContent(day({ meals: [] }))).toBe(false);
  });

  it('is true for a day with at least one meal', () => {
    expect(hasContent(day())).toBe(true);
  });
});
