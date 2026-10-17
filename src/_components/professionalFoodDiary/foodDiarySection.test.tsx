import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { ProfessionalFoodDiary } from '@/_types/professionalFoodDiary';
import { FoodDiarySection } from './foodDiarySection';

describe('FoodDiarySection', () => {
  // US-016.EC-1: no linked account — distinct from "linked but unused".
  it('shows the no-linked-account empty state when hasAccount is false', () => {
    const diary: ProfessionalFoodDiary = {
      hasAccount: false,
      meals: [],
      waterLogs: [],
    };
    const html = renderToStaticMarkup(<FoodDiarySection diary={diary} />);

    expect(html).toContain('ainda não tem uma conta vinculada');
    expect(html).not.toContain('ainda não registrou');
  });

  // US-016.EC-2: linked but never used the diary — a different message.
  it('shows the linked-but-empty state when hasAccount is true with no history', () => {
    const diary: ProfessionalFoodDiary = {
      hasAccount: true,
      meals: [],
      waterLogs: [],
    };
    const html = renderToStaticMarkup(<FoodDiarySection diary={diary} />);

    expect(html).toContain('ainda não registrou nenhuma refeição');
    expect(html).not.toContain('ainda não tem uma conta vinculada');
  });

  it('shows the grouped meal/water history when present', () => {
    const diary: ProfessionalFoodDiary = {
      hasAccount: true,
      meals: [
        {
          id: 'm1',
          mealType: 'LUNCH',
          description: 'Arroz, feijão e frango',
          calories: 650,
          loggedAt: '2026-10-15T12:00:00.000Z',
        },
      ],
      waterLogs: [{ date: '2026-10-15', count: 3 }],
    };
    const html = renderToStaticMarkup(<FoodDiarySection diary={diary} />);

    expect(html).toContain('15/10/2026');
    expect(html).toContain('Arroz, feijão e frango');
    expect(html).toContain('Almoço');
    expect(html).toContain('650');
    expect(html).toContain('3 copos');
  });
});
