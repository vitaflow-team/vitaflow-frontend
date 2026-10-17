import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { MealPlanDay, MealPlanDraft } from '@/_types/mealPlan';

vi.mock('./dayEditDialog', () => ({
  DayEditDialog: ({ triggerLabel }: { triggerLabel: string }) => (
    <button type="button">{triggerLabel}</button>
  ),
}));
vi.mock('./cloneDayDialog', () => ({
  CloneDayDialog: () => <button type="button">Clonar dia</button>,
}));

import { WeekdayCard } from './weekdayCard';

function draft(): MealPlanDraft {
  return { id: 'plan-1', days: [] };
}

describe('WeekdayCard', () => {
  it('shows the empty state and "Adicionar refeições" when the day has no meals', () => {
    const html = renderToStaticMarkup(
      <WeekdayCard
        clientId="client-1"
        weekday="MONDAY"
        day={null}
        draft={draft()}
        versions={[]}
      />
    );
    expect(html).toContain('Segunda');
    expect(html).toContain('Nenhuma refeição definida.');
    expect(html).toContain('Adicionar refeições');
  });

  it('lists each meal and offers "Editar" when the day has content', () => {
    const day: MealPlanDay = {
      id: 'day-1',
      weekday: 'TUESDAY',
      meals: [{ id: 'meal-1', label: 'Almoço', text: 'Arroz e feijão' }],
    };
    const html = renderToStaticMarkup(
      <WeekdayCard
        clientId="client-1"
        weekday="TUESDAY"
        day={day}
        draft={draft()}
        versions={[]}
      />
    );
    expect(html).toContain('Almoço');
    expect(html).toContain('Arroz e feijão');
    expect(html).toContain('Editar');
  });
});
