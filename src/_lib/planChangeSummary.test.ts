import { describe, expect, it } from 'vitest';
import { summarizePlanChange } from './planChangeSummary';

const FREE = { id: 'p-free', type: 'USER' as const };
const PREMIUM = { id: 'p-premium', type: 'USER' as const };
const NUTRI = { id: 'p-nutri', type: 'NUTRITIONIST' as const };
const EDUCATOR = { id: 'p-edu', type: 'PHYSICAL_EDUCATOR' as const };

describe('plan change summary — summarizePlanChange', () => {
  it('UT-022 describes Gratuito to a nutritionist plan as a checkout', () => {
    const summary = summarizePlanChange({
      current: FREE,
      target: NUTRI,
      hasActiveSubscription: false,
      clientsCount: 0,
    });

    expect(summary).toEqual({
      audienceChange: true,
      gainedSections: ['Pessoas'],
      lostSections: [],
      hiddenClients: 0,
      charge: 'checkout',
    });
  });

  it('UT-023 describes a switch between professions as proration', () => {
    const summary = summarizePlanChange({
      current: NUTRI,
      target: EDUCATOR,
      hasActiveSubscription: true,
      clientsCount: 4,
    });

    expect(summary).toEqual({
      audienceChange: true,
      gainedSections: [],
      lostSections: [],
      hiddenClients: 0,
      charge: 'immediate-proration',
    });
  });

  it('UT-024 hides the clients when a professional moves to Premium', () => {
    const summary = summarizePlanChange({
      current: EDUCATOR,
      target: PREMIUM,
      hasActiveSubscription: true,
      clientsCount: 7,
    });

    expect(summary?.lostSections).toEqual(['Pessoas']);
    expect(summary?.gainedSections).toEqual([]);
    expect(summary?.hiddenClients).toBe(7);
    expect(summary?.audienceChange).toBe(true);
  });

  it('UT-025 separates no clients from an unavailable count', () => {
    const zero = summarizePlanChange({
      current: EDUCATOR,
      target: PREMIUM,
      hasActiveSubscription: true,
      clientsCount: 0,
    });
    expect(zero?.hiddenClients).toBe(0);

    const unknown = summarizePlanChange({
      current: EDUCATOR,
      target: PREMIUM,
      hasActiveSubscription: true,
      clientsCount: null,
    });
    expect(unknown?.hiddenClients).toBe('unknown');

    // Um count ausente sem sair de um plano profissional não esconde nada.
    const staying = summarizePlanChange({
      current: FREE,
      target: PREMIUM,
      hasActiveSubscription: false,
      clientsCount: null,
    });
    expect(staying?.hiddenClients).toBe(0);
  });

  it('UT-026 returns nothing when the target is the current plan', () => {
    expect(
      summarizePlanChange({
        current: NUTRI,
        target: { id: NUTRI.id, type: 'NUTRITIONIST' },
        hasActiveSubscription: true,
        clientsCount: 3,
      })
    ).toBeNull();
  });

  it('UT-026 still summarizes when there is no current plan id', () => {
    const summary = summarizePlanChange({
      current: { id: null, type: 'USER' },
      target: PREMIUM,
      hasActiveSubscription: false,
      clientsCount: null,
    });

    expect(summary).not.toBeNull();
    expect(summary?.audienceChange).toBe(false);
    expect(summary?.charge).toBe('checkout');
  });
});
