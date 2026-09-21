import type { ProfileShell } from '@/_types/shell';
import { describe, expect, it } from 'vitest';
import { getPlanSummary } from './planSummary';

const PLAN_HREF = '/restrict/settings?tab=plano';

function shell(overrides: Partial<ProfileShell> = {}): ProfileShell {
  return {
    firstName: 'Fernando',
    avatar: null,
    productName: null,
    subscriptionStatus: null,
    expiresAt: null,
    autoRenew: false,
    ...overrides,
  };
}

describe('restricted sidebar plan summary — getPlanSummary', () => {
  it('UT-024 shows the free plan with the upgrade call to action', () => {
    expect(getPlanSummary(shell({ productName: 'Gratuito' }))).toEqual({
      name: 'Plano Gratuito',
      detail: null,
      cta: { label: 'Conhecer o Premium', href: PLAN_HREF },
    });
  });

  it('UT-024 treats no product and no status as the free plan', () => {
    expect(
      getPlanSummary(shell({ productName: null, subscriptionStatus: null }))
    ).toEqual({
      name: 'Plano Gratuito',
      detail: null,
      cta: { label: 'Conhecer o Premium', href: PLAN_HREF },
    });
  });

  it('UT-024 words an auto-renewing plan as renewing', () => {
    expect(
      getPlanSummary(
        shell({
          productName: 'Premium',
          subscriptionStatus: 'active',
          expiresAt: '2026-10-18T15:00:00.000Z',
          autoRenew: true,
        })
      )
    ).toEqual({
      name: 'Plano Premium',
      detail: { kind: 'renews', label: 'Renova em 18/10/2026' },
      cta: { label: 'Gerenciar plano', href: PLAN_HREF },
    });
  });

  it('UT-024 words a plan that will not renew as expiring', () => {
    expect(
      getPlanSummary(
        shell({
          productName: 'Premium',
          subscriptionStatus: 'active',
          expiresAt: '2026-10-10T15:00:00.000Z',
          autoRenew: false,
        })
      ).detail
    ).toEqual({ kind: 'expires', label: 'Expira em 10/10/2026' });
  });

  it('UT-024 invents no date when the backend sends none', () => {
    const summary = getPlanSummary(
      shell({
        productName: 'Premium',
        subscriptionStatus: 'active',
        expiresAt: null,
        autoRenew: true,
      })
    );

    expect(summary.name).toBe('Plano Premium');
    expect(summary.detail).toBeNull();
  });

  it('UT-024 falls back to a neutral label when the profile is unavailable', () => {
    const summary = getPlanSummary(null);

    expect(summary.name).toBe('Seu plano');
    expect(summary.detail).toBeNull();
    expect(summary.cta.href).toBe(PLAN_HREF);
  });
});
