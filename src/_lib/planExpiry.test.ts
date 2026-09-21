import { describe, expect, it } from 'vitest';
import { formatPlanDate, planExpiry } from './planExpiry';

describe('plan expiry wording — formatPlanDate', () => {
  it('UT-023 uses the São Paulo calendar day, not the UTC one', () => {
    expect(formatPlanDate('2026-10-01T02:30:00Z')).toBe('30/09/2026');
    expect(formatPlanDate('2026-10-18T15:00:00Z')).toBe('18/10/2026');
  });
});

describe('plan expiry wording — planExpiry', () => {
  it('UT-025 words a renewing subscription as "Renova em"', () => {
    expect(
      planExpiry({ expiresAt: '2026-10-18T15:00:00Z', autoRenew: true })
    ).toEqual({ kind: 'renews', label: 'Renova em 18/10/2026' });
  });

  it('UT-025 words a scheduled cancellation as "Expira em" with the alert kind', () => {
    const expiry = planExpiry({
      expiresAt: '2026-10-10T15:00:00Z',
      autoRenew: false,
    });

    expect(expiry).toEqual({ kind: 'expires', label: 'Expira em 10/10/2026' });
    // `expires` é o que marca o tom de alerta para quem renderiza (US-002.EC-4).
    expect(expiry?.kind).toBe('expires');
  });

  it('UT-025 invents nothing without a date', () => {
    expect(planExpiry({ expiresAt: null, autoRenew: true })).toBeNull();
    expect(planExpiry({ expiresAt: null, autoRenew: false })).toBeNull();
  });
});
