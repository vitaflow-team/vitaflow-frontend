import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { Meal } from '@/_types/foodDiary';

vi.mock('./mealItem', () => ({
  MealItem: ({ meal }: { meal: Meal }) => <i data-testid={`meal-${meal.id}`} />,
}));

import { MealList } from './mealList';

describe('MealList', () => {
  it('shows an explicit empty state instead of a blank list', () => {
    const markup = renderToStaticMarkup(<MealList meals={[]} />);

    expect(markup).toContain('Nenhuma refeição registrada');
  });

  it('renders one item per meal', () => {
    const meals: Meal[] = [
      {
        id: 'm1',
        mealType: 'LUNCH',
        description: 'x',
        calories: 1,
        loggedAt: '',
      },
      {
        id: 'm2',
        mealType: 'DINNER',
        description: 'y',
        calories: 2,
        loggedAt: '',
      },
    ];

    const markup = renderToStaticMarkup(<MealList meals={meals} />);

    expect(markup).toContain('data-testid="meal-m1"');
    expect(markup).toContain('data-testid="meal-m2"');
  });
});
