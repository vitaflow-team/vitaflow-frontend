import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { MealPlanDay } from '@/_types/mealPlan';
import { SourceDayList } from './sourceDayList';

describe('SourceDayList', () => {
  it('explains there is nothing to clone when the list is empty', () => {
    const html = renderToStaticMarkup(
      <SourceDayList days={[]} disabled={false} onSelect={vi.fn()} />
    );
    expect(html).toContain('Nenhum dia com refeições para clonar.');
  });

  it('shows each day with its weekday label and meal count', () => {
    const days: MealPlanDay[] = [
      {
        id: 'day-1',
        weekday: 'FRIDAY',
        meals: [
          { id: 'm1', label: 'Almoço', text: 'x' },
          { id: 'm2', label: 'Jantar', text: 'y' },
        ],
      },
    ];
    const html = renderToStaticMarkup(
      <SourceDayList days={days} disabled={false} onSelect={vi.fn()} />
    );
    expect(html).toContain('Sexta');
    expect(html).toContain('2 refeição(ões)');
  });
});
