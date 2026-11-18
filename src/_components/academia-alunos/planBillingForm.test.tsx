import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({
    isPending: false,
    isError: false,
    execute: vi.fn(),
  }),
}));
vi.mock('@/_actions/academia/assignAccessPlan', () => ({
  assignAccessPlan: {},
}));

import type { AcademiaAccessPlan } from '@/_types/academia';
import { PlanBillingForm } from './planBillingForm';

const PLAN: AcademiaAccessPlan = {
  id: 'plan-1',
  name: 'Mensal',
  validityType: 'DAYS',
  validityValue: 30,
  referencePrice: '149.90',
  active: true,
};

function render(
  availability: 'READY' | 'NOT_CONNECTED' | 'SUBSCRIPTION_REQUIRED',
  plan: AcademiaAccessPlan = PLAN
) {
  return renderToStaticMarkup(
    <PlanBillingForm
      clientId="client-1"
      plan={plan}
      availability={availability}
      onAssigned={() => {}}
    />
  );
}

describe('PlanBillingForm — financial-health US-012', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-17T15:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('UT-141 starts with the fee on: today as the due day and the plan price as the amount', () => {
    const html = render('READY');

    expect(html).toContain('Mensal');
    expect(html).toContain('Cobrar mensalidade deste aluno');
    expect(html).toMatch(/checked=""/);
    expect(html).toMatch(/<option value="17" selected="">/);
    expect(html).toContain('value="149,90"');
    expect(html).toContain('Vincular plano');
  });

  it('caps the default due day at 28', () => {
    vi.setSystemTime(new Date('2026-10-31T15:00:00Z'));

    expect(render('READY')).toMatch(/<option value="28" selected="">/);
  });

  it('does not offer the fee when billing is not connected, and says so', () => {
    const html = render('NOT_CONNECTED');

    expect(html).not.toContain('Cobrar mensalidade deste aluno');
    expect(html).not.toContain('Dia de vencimento');
    expect(html).toContain('Conecte a conta Asaas da academia');
    expect(html).toContain('Vincular plano');
  });

  it('asks for a paid subscription instead of Premium when the gym has none', () => {
    const html = render('SUBSCRIPTION_REQUIRED');

    expect(html).toContain('assinatura ativa');
    expect(html).not.toContain('Premium');
  });

  it('leaves the fee off for a free plan, which is never billed', () => {
    const html = render('READY', { ...PLAN, referencePrice: 0 });

    expect(html).toContain('Cobrar mensalidade deste aluno');
    expect(html).not.toMatch(/checked=""/);
    expect(html).not.toContain('Dia de vencimento');
  });
});
