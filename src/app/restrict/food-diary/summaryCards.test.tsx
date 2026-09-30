import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { DailySummary } from '@/_types/foodDiary';

vi.mock('./waterTapControl', () => ({
  WaterTapControl: ({ initialCount }: { initialCount: number }) => (
    <i data-testid="water-control" data-count={initialCount} />
  ),
}));

import { SummaryCards } from './summaryCards';

const SUMMARY: DailySummary = {
  meals: [],
  totalCalories: 1240,
  goal: 2000,
  waterCount: 3,
  streak: 5,
};

describe('SummaryCards', () => {
  it('shows the total calories and the goal when known', () => {
    const markup = renderToStaticMarkup(
      <SummaryCards summary={SUMMARY} date="2026-09-30" />
    );

    expect(markup).toContain('1.240');
    expect(markup).toContain('2.000');
    expect(markup).toContain('(estimado)');
  });

  it('prompts profile completion instead of a goal number when goal is null', () => {
    const markup = renderToStaticMarkup(
      <SummaryCards summary={{ ...SUMMARY, goal: null }} date="2026-09-30" />
    );

    expect(markup).toContain('Complete seu perfil');
  });

  it('shows the streak count with correct pluralization', () => {
    const markup = renderToStaticMarkup(
      <SummaryCards summary={{ ...SUMMARY, streak: 1 }} date="2026-09-30" />
    );

    expect(markup).toContain('>1<');
    expect(markup).toContain('dia<');
  });

  it('passes the water count to the water control', () => {
    const markup = renderToStaticMarkup(
      <SummaryCards summary={SUMMARY} date="2026-09-30" />
    );

    expect(markup).toContain('data-count="3"');
  });
});
