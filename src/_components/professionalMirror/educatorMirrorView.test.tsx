import type { EducatorMirror } from '@/_types/professionalMirror';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EducatorMirrorView } from './educatorMirrorView';

const MIRROR: EducatorMirror = {
  professional: { id: 'p1', name: 'Prof. Bruno', specialty: 'Funcional' },
  todayWorkout: null,
  nextSchedule: null,
  physicalAssessment: null,
  billingStatus: null,
};

const ASSESSMENTS = [
  {
    id: 'a3',
    recordedAt: '2026-09-15T12:00:00.000Z',
    values: [
      { fieldLabel: 'Peso (kg)', value: 78.2 },
      { fieldLabel: 'Gordura corporal (%)', value: 18.4 },
    ],
    bmi: { value: 24.1, classification: 'PESO_NORMAL' as const },
  },
  {
    id: 'a2',
    recordedAt: '2026-08-18T12:00:00.000Z',
    values: [
      { fieldLabel: 'Peso (kg)', value: 79 },
      { fieldLabel: 'Gordura corporal (%)', value: null },
    ],
    bmi: null,
  },
  {
    id: 'a1',
    recordedAt: '2026-07-21T12:00:00.000Z',
    values: [
      { fieldLabel: 'Peso (kg)', value: 80.3 },
      { fieldLabel: 'Gordura corporal (%)', value: 19.9 },
    ],
    bmi: null,
  },
];

function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

describe('EducatorMirrorView', () => {
  // US-001, US-002, US-002.EC-1, US-006
  it('shows the real identity plus every contract section as an honest empty state', () => {
    const html = renderToStaticMarkup(<EducatorMirrorView mirror={MIRROR} />);

    expect(html).toContain('Prof. Bruno');
    expect(html).toContain('Treino de hoje');
    expect(html).toContain('Próximo horário');
    expect(html).toContain('Avaliação física');
    expect(html).toContain('Cobrança');
    expect(html).toContain('ainda não configurou o treino de hoje');
  });

  it('UT-164 lists up to three assessments with date and field values, "—" when missing', () => {
    const html = renderToStaticMarkup(
      <EducatorMirrorView
        mirror={{ ...MIRROR, physicalAssessment: ASSESSMENTS }}
      />
    );
    const body = text(html);

    expect(body).toContain('15/09/2026');
    expect(body).toContain('Peso (kg)');
    expect(body).toContain('78.2');
    expect(body).toContain('Gordura corporal (%)');
    expect(body).toContain('18.4');
    expect(body).toContain('—');
    expect(body).toContain('IMC 24,1 · Peso normal');
    expect(body).not.toContain('Nenhuma avaliação física registrada ainda.');
  });

  it('UT-128 shows the current workout title and sessions, no session as today and a link to the educator plan', () => {
    const html = renderToStaticMarkup(
      <EducatorMirrorView
        mirror={{
          ...MIRROR,
          todayWorkout: {
            id: 'w1',
            title: 'Hipertrofia',
            weeklyFrequency: 4,
            todaySessionId: null,
            sessions: [
              { id: 's1', label: 'A', name: 'Peito', exerciseCount: 6 },
              { id: 's2', label: 'B', name: 'Costas', exerciseCount: 5 },
            ],
          },
        }}
      />
    );
    const body = text(html);

    expect(body).toContain('Hipertrofia');
    expect(body).toContain('4x por semana');
    expect(body).toContain('Sessão A — Peito');
    expect(body).toContain('Sessão B — Costas');
    expect(html).toContain('href="/restrict/workouts?plano=educador"');
    expect(body).not.toMatch(/hoje|Hoje/);
    expect(body).not.toContain('ainda não configurou o treino');
  });

  it('UT-128 keeps the honest empty state when todayWorkout is null', () => {
    const html = renderToStaticMarkup(<EducatorMirrorView mirror={MIRROR} />);

    expect(text(html)).toContain('ainda não configurou o treino de hoje');
    expect(html).not.toContain('plano=educador');
  });

  it('UT-165 keeps the honest empty state when there is no assessment', () => {
    const html = renderToStaticMarkup(<EducatorMirrorView mirror={MIRROR} />);

    expect(text(html)).toContain('Nenhuma avaliação física registrada ainda.');
  });

  it('UT-166 offers no way to add, edit or delete an assessment', () => {
    const html = renderToStaticMarkup(
      <EducatorMirrorView
        mirror={{ ...MIRROR, physicalAssessment: ASSESSMENTS }}
      />
    );

    expect(html).not.toMatch(/<button/);
    expect(html).not.toMatch(/Nova avaliação|Editar|Excluir|Remover/);
  });
});
