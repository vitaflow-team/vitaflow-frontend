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
});
