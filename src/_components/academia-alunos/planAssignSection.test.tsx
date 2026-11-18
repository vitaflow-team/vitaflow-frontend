import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./planBillingForm', () => ({
  PlanBillingForm: () => <p>formulário do plano</p>,
}));

import type { AcademiaAccessPlan } from '@/_types/academia';
import { PlanAssignSection } from './planAssignSection';

const CATALOG: AcademiaAccessPlan[] = [
  {
    id: 'p1',
    name: 'Mensal',
    validityType: 'DAYS',
    validityValue: 30,
    referencePrice: '149.90',
    active: true,
  },
  {
    id: 'p2',
    name: '10 acessos',
    validityType: 'VISITS',
    validityValue: 10,
    referencePrice: '90',
    active: true,
  },
];

function render(hasPlan: boolean) {
  return renderToStaticMarkup(
    <PlanAssignSection
      clientId="client-1"
      catalog={CATALOG}
      hasPlan={hasPlan}
      availability="READY"
      onAssigned={() => {}}
    />
  );
}

describe('PlanAssignSection — financial-health US-012', () => {
  it('lists the catalog plans and opens no form until one is chosen', () => {
    const html = render(false);

    expect(html).toContain('Mensal');
    expect(html).toContain('10 acessos');
    expect(html).toContain('aria-pressed="false"');
    expect(html).not.toContain('formulário do plano');
  });

  it('says "Atribuir plano" for a student without a plan and "Trocar plano" for one with a plan', () => {
    expect(render(false)).toContain('Atribuir plano');
    expect(render(true)).toContain('Trocar plano');
  });
});
