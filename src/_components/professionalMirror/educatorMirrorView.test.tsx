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
  { id: 'a3', assessedOn: '2026-09-15', weightKg: 78.2, bodyFatPercent: 18.4 },
  { id: 'a2', assessedOn: '2026-08-18', weightKg: 79, bodyFatPercent: null },
  { id: 'a1', assessedOn: '2026-07-21', weightKg: 80.3, bodyFatPercent: 19.9 },
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

  it('UT-164 lists up to three assessments with date, weight and body fat, "—" when missing', () => {
    const html = renderToStaticMarkup(
      <EducatorMirrorView
        mirror={{ ...MIRROR, physicalAssessment: ASSESSMENTS }}
      />
    );
    const body = text(html);

    expect(html.match(/dateTime="20\d\d-\d\d-\d\d"/g)).toHaveLength(3);
    expect(body).toContain('15/09/2026');
    expect(body).toContain('78,2 kg');
    expect(body).toContain('Gordura corporal: 18,4%');
    expect(body).toContain('Gordura corporal: —');
    expect(body).not.toContain('Nenhuma avaliação física registrada ainda.');
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
