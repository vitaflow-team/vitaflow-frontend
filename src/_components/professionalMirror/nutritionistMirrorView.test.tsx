import type { NutritionistMirror } from '@/_types/professionalMirror';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { NutritionistMirrorView } from './nutritionistMirrorView';

const MIRROR: NutritionistMirror = {
  professional: { id: 'p1', name: 'Dra. Ana', specialty: 'Nutrição esportiva' },
  mealPlan: null,
  nextConsultation: null,
  billingStatus: null,
};

describe('NutritionistMirrorView', () => {
  // US-001, US-002, US-002.EC-1
  it('shows the real identity plus every contract section as an honest empty state', () => {
    const html = renderToStaticMarkup(
      <NutritionistMirrorView mirror={MIRROR} />
    );

    expect(html).toContain('Dra. Ana');
    expect(html).toContain('Plano alimentar');
    expect(html).toContain('Próxima consulta');
    expect(html).toContain('Cobrança');
    expect(html).toContain('ainda não configurou um plano alimentar');
  });

  it('never shows the prototype’s original example content', () => {
    const html = renderToStaticMarkup(
      <NutritionistMirrorView mirror={MIRROR} />
    );

    expect(html).not.toContain('Emagrecimento');
    expect(html).not.toContain('R$ 150');
  });
});
