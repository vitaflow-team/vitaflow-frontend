import { describe, expect, it } from 'vitest';
import { MEALS_PER_DAY_MAX, saveDaySchema } from './mealPlan';

const CLIENT_ID = '01a14821-d615-77d3-a13e-ba687f15b95c';

describe('saveDaySchema', () => {
  it('accepts a day with meals within the limits', () => {
    const result = saveDaySchema.safeParse({
      clientId: CLIENT_ID,
      weekday: 'MONDAY',
      meals: [{ label: 'Almoço', text: 'Arroz e feijão' }],
    });
    expect(result.success).toBe(true);
  });

  it('accepts an empty meal list (a day with nothing defined)', () => {
    const result = saveDaySchema.safeParse({
      clientId: CLIENT_ID,
      weekday: 'MONDAY',
      meals: [],
    });
    expect(result.success).toBe(true);
  });

  it('rejects more than the maximum meals per day', () => {
    const meals = Array.from({ length: MEALS_PER_DAY_MAX + 1 }, (_, index) => ({
      label: `Refeição ${index}`,
      text: 'texto',
    }));
    const result = saveDaySchema.safeParse({
      clientId: CLIENT_ID,
      weekday: 'MONDAY',
      meals,
    });
    expect(result.success).toBe(false);
  });

  it('rejects a blank meal label', () => {
    const result = saveDaySchema.safeParse({
      clientId: CLIENT_ID,
      weekday: 'MONDAY',
      meals: [{ label: '   ', text: 'Arroz' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid weekday', () => {
    const result = saveDaySchema.safeParse({
      clientId: CLIENT_ID,
      weekday: 'FUNDAY',
      meals: [],
    });
    expect(result.success).toBe(false);
  });
});
