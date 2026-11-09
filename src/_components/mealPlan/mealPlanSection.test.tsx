import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

// `PublishButton`/`VersionHistoryPanel`/`WeekdayGrid` pull in Server
// Actions and `zsa-react`, none of which this file's assertions concern —
// stubbed the same way `nutritionistMirrorView.test.tsx` stubs
// `MirrorMealPlanVersionHistory`.
vi.mock('./publishButton', () => ({
  PublishButton: () => <button type="button">Publicar plano</button>,
}));
vi.mock('./versionHistoryPanel', () => ({
  VersionHistoryPanel: () => (
    <button type="button">Histórico de versões</button>
  ),
}));
vi.mock('./weekdayGrid', () => ({
  WeekdayGrid: () => <div>grid</div>,
}));
vi.mock('./mealPlanAiGenerator', () => ({
  MealPlanAiGenerator: () => <button type="button">Gerar com IA</button>,
}));

import type { MealPlanDraft } from '@/_types/mealPlan';
import { MealPlanSection } from './mealPlanSection';

const DRAFT: MealPlanDraft = { id: 'd1', days: [] };

describe('MealPlanSection — pdf-export US-001', () => {
  it('UT-034 renders an Exportar PDF link pointing at the current draft', () => {
    const html = renderToStaticMarkup(
      <MealPlanSection clientId="client-1" draft={DRAFT} versions={[]} />
    );

    expect(html).toContain(
      'href="/api/professionals/clients/client-1/meal-plan/draft/pdf"'
    );
    expect(html).toContain('Exportar PDF');
  });
});

describe('MealPlanSection — ai-meal-plan-generator entry point', () => {
  it('UT-032 (happy) renders the "Gerar com IA" entry point alongside the existing PublishButton/PDF-export controls', () => {
    const html = renderToStaticMarkup(
      <MealPlanSection clientId="client-1" draft={DRAFT} versions={[]} />
    );

    expect(html).toContain('Gerar com IA');
    expect(html).toContain('Publicar plano');
    expect(html).toContain('Exportar PDF');
  });
});
