import type { NutritionistMirror } from '@/_types/professionalMirror';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./mirrorMealPlanVersionHistory', () => ({
  MirrorMealPlanVersionHistory: () => (
    <button type="button">Histórico de versões</button>
  ),
}));

import { NutritionistMirrorView } from './nutritionistMirrorView';

const MIRROR: NutritionistMirror = {
  professional: { id: 'p1', name: 'Dra. Ana', specialty: 'Nutrição esportiva' },
  anamnese: null,
  assessmentHistory: [],
  mealPlan: null,
  nextConsultation: null,
  billingStatus: null,
};

const ANAMNESE: NutritionistMirror['anamnese'] = {
  id: 'a1',
  recordedAt: '2026-09-01T12:00:00.000Z',
  values: [{ fieldLabel: 'Objetivo', value: 'Emagrecimento saudável' }],
  bmi: null,
};

const ASSESSMENT_HISTORY: NutritionistMirror['assessmentHistory'] = [
  {
    id: 'h1',
    recordedAt: '2026-09-15T12:00:00.000Z',
    values: [{ fieldLabel: 'Peso (kg)', value: 78 }],
    bmi: { value: 25.5, classification: 'SOBREPESO' },
  },
];

const MEAL_PLAN: NonNullable<NutritionistMirror['mealPlan']> = {
  currentVersion: 2,
  publishedAt: '2026-10-10T12:00:00.000Z',
  days: [
    {
      weekday: 'MONDAY',
      meals: [{ id: 'm1', label: 'Almoço', text: 'Salada e peixe' }],
    },
  ],
  versions: [
    { version: 2, publishedAt: '2026-10-10T12:00:00.000Z' },
    { version: 1, publishedAt: '2026-10-01T12:00:00.000Z' },
  ],
};

function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

describe('NutritionistMirrorView', () => {
  it('shows the real identity plus every not-yet-real contract section as an honest empty state', () => {
    const html = renderToStaticMarkup(
      <NutritionistMirrorView mirror={MIRROR} />
    );
    const body = text(html);

    expect(body).toContain('Dra. Ana');
    expect(body).toContain('Sua nutricionista ainda não preencheu a anamnese.');
    expect(body).toContain('Nenhuma avaliação registrada ainda.');
    expect(body).toContain(
      'Sua nutricionista ainda não configurou um plano alimentar.'
    );
    expect(body).toContain('Próxima consulta');
    expect(body).toContain('Cobrança');
  });

  // US-018: the patient sees their own current anamnese answers.
  it('shows the anamnese answers when filled', () => {
    const html = renderToStaticMarkup(
      <NutritionistMirrorView mirror={{ ...MIRROR, anamnese: ANAMNESE }} />
    );
    const body = text(html);

    expect(body).toContain('Objetivo');
    expect(body).toContain('Emagrecimento saudável');
    expect(body).not.toContain('ainda não preencheu a anamnese');
  });

  // US-019 / E2E-002: full assessment history with BMI, never capped.
  it('shows the full assessment history with BMI', () => {
    const html = renderToStaticMarkup(
      <NutritionistMirrorView
        mirror={{ ...MIRROR, assessmentHistory: ASSESSMENT_HISTORY }}
      />
    );
    const body = text(html);

    expect(body).toContain('Histórico de avaliações');
    expect(body).toContain('Peso (kg)');
    expect(body).toContain('IMC 25,5 · Sobrepeso');
    expect(body).not.toContain('Nenhuma avaliação registrada ainda.');
  });

  // US-020 / E2E-002: current version's content plus access to past versions.
  it('shows the current meal plan and its version history trigger', () => {
    const html = renderToStaticMarkup(
      <NutritionistMirrorView mirror={{ ...MIRROR, mealPlan: MEAL_PLAN }} />
    );
    const body = text(html);

    expect(body).toContain('Versão 2');
    expect(body).toContain('Segunda');
    expect(body).toContain('Almoço');
    expect(body).toContain('Salada e peixe');
    expect(body).toContain('Histórico de versões');
    expect(body).not.toContain('ainda não configurou um plano alimentar');
  });

  it('never shows the prototype’s original example content', () => {
    const html = renderToStaticMarkup(
      <NutritionistMirrorView mirror={MIRROR} />
    );

    expect(html).not.toContain('Emagrecimento');
    expect(html).not.toContain('R$ 150');
  });
});
