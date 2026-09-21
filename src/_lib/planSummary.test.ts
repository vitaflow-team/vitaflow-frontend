import type { ProfileShell } from '@/_types/shell';
import { describe, expect, it } from 'vitest';
import { formatPlanDate, getPlanSummary } from './planSummary';

const PLAN_HREF = '/restrict/settings?tab=plano';

function shell(overrides: Partial<ProfileShell> = {}): ProfileShell {
  return {
    firstName: 'Fernando',
    avatar: null,
    productName: null,
    subscriptionStatus: null,
    subscriptionCancelAt: null,
    subscriptionCurrentPeriodEnd: null,
    ...overrides,
  };
}

describe('restricted sidebar plan summary — getPlanSummary', () => {
  it('UT-030 shows the free plan with the upgrade call to action', () => {
    expect(getPlanSummary(shell({ productName: 'Gratuito' }))).toEqual({
      name: 'Plano Gratuito',
      detail: null,
      cta: { label: 'Conhecer o Premium', href: PLAN_HREF },
    });
  });

  it('UT-031 treats no product and no status as the free plan', () => {
    expect(
      getPlanSummary(shell({ productName: null, subscriptionStatus: null }))
    ).toEqual({
      name: 'Plano Gratuito',
      detail: null,
      cta: { label: 'Conhecer o Premium', href: PLAN_HREF },
    });
  });

  it('UT-032 shows the renewal date of an active paid plan', () => {
    expect(
      getPlanSummary(
        shell({
          productName: 'Premium',
          subscriptionStatus: 'active',
          subscriptionCurrentPeriodEnd: '2026-10-18T15:00:00.000Z',
        })
      )
    ).toEqual({
      name: 'Plano Premium',
      detail: { kind: 'renews', date: '18/10/2026' },
      cta: { label: 'Gerenciar plano', href: PLAN_HREF },
    });
  });

  it('UT-033 lets a scheduled cancellation take precedence over renewal', () => {
    expect(
      getPlanSummary(
        shell({
          productName: 'Premium',
          subscriptionStatus: 'active',
          subscriptionCurrentPeriodEnd: '2026-10-18T15:00:00.000Z',
          subscriptionCancelAt: '2026-10-18T15:00:00.000Z',
        })
      ).detail
    ).toEqual({ kind: 'cancels', date: '18/10/2026' });
  });

  it('UT-034 shows no date for a subscription that is not active', () => {
    expect(
      getPlanSummary(
        shell({
          productName: 'Premium',
          subscriptionStatus: 'canceled',
          subscriptionCurrentPeriodEnd: '2026-10-18T15:00:00.000Z',
        })
      ).detail
    ).toBeNull();
  });

  it('UT-035 invents no date when the period end is unknown', () => {
    const summary = getPlanSummary(
      shell({
        productName: 'Premium',
        subscriptionStatus: 'active',
        subscriptionCurrentPeriodEnd: null,
      })
    );

    expect(summary.name).toBe('Plano Premium');
    expect(summary.detail).toBeNull();
  });

  it('UT-036 falls back to a neutral label when the profile is unavailable', () => {
    const summary = getPlanSummary(null);

    expect(summary.name).toBe('Seu plano');
    expect(summary.detail).toBeNull();
    expect(summary.cta.href).toBe(PLAN_HREF);
  });
});

describe('restricted sidebar plan summary — formatPlanDate', () => {
  it('UT-037 uses the São Paulo calendar day, not the UTC one', () => {
    expect(formatPlanDate('2026-10-18T02:00:00.000Z')).toBe('17/10/2026');
    expect(formatPlanDate('2026-10-18T15:00:00.000Z')).toBe('18/10/2026');
  });
});
