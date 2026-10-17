import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { MealPlanDay } from '@/_types/mealPlan';
import { ReadOnlyWeekdayList } from './readOnlyWeekdayList';

describe('ReadOnlyWeekdayList', () => {
  it('shows all seven weekdays, filled or empty', () => {
    const days: MealPlanDay[] = [
      {
        id: 'day-1',
        weekday: 'MONDAY',
        meals: [{ id: 'm1', label: 'Café da manhã', text: 'Ovos e pão' }],
      },
    ];
    const html = renderToStaticMarkup(<ReadOnlyWeekdayList days={days} />);
    expect(html).toContain('Segunda');
    expect(html).toContain('Café da manhã');
    expect(html).toContain('Ovos e pão');
    expect(html).toContain('Domingo');
    expect(html).toContain('Nenhuma refeição definida.');
  });
});
