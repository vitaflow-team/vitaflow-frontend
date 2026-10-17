import { describe, expect, it } from 'vitest';
import { groupByDay } from './professionalFoodDiaryHistory';
import type { Meal } from '@/_types/foodDiary';

function meal(overrides: Partial<Meal> = {}): Meal {
  return {
    id: 'm1',
    mealType: 'LUNCH',
    description: 'Arroz e feijão',
    calories: 650,
    loggedAt: '2026-10-15T12:00:00.000Z',
    ...overrides,
  };
}

describe('groupByDay', () => {
  it('groups meals by their loggedAt calendar date', () => {
    const result = groupByDay(
      [
        meal({ id: 'm1', loggedAt: '2026-10-15T08:00:00.000Z' }),
        meal({ id: 'm2', loggedAt: '2026-10-15T19:00:00.000Z' }),
        meal({ id: 'm3', loggedAt: '2026-10-14T12:00:00.000Z' }),
      ],
      []
    );

    expect(result).toHaveLength(2);
    expect(result[0].date).toBe('2026-10-15');
    expect(result[0].meals.map(m => m.id)).toEqual(['m1', 'm2']);
    expect(result[1].date).toBe('2026-10-14');
  });

  it('sorts days newest first', () => {
    const result = groupByDay(
      [
        meal({ id: 'm1', loggedAt: '2026-10-01T12:00:00.000Z' }),
        meal({ id: 'm2', loggedAt: '2026-10-20T12:00:00.000Z' }),
      ],
      []
    );

    expect(result.map(d => d.date)).toEqual(['2026-10-20', '2026-10-01']);
  });

  it('merges a day with only water logged, no meals', () => {
    const result = groupByDay([], [{ date: '2026-10-15', count: 5 }]);

    expect(result).toEqual([{ date: '2026-10-15', meals: [], waterCount: 5 }]);
  });

  it('merges meals and water on the same day into one entry', () => {
    const result = groupByDay(
      [meal({ loggedAt: '2026-10-15T08:00:00.000Z' })],
      [{ date: '2026-10-15', count: 3 }]
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ date: '2026-10-15', waterCount: 3 });
    expect(result[0].meals).toHaveLength(1);
  });

  it('returns an empty list when there is no history', () => {
    expect(groupByDay([], [])).toEqual([]);
  });
});
