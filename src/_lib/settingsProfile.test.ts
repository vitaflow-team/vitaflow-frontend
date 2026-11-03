import type { SettingsProfile } from '@/_types/settingsProfile';
import { describe, expect, it } from 'vitest';
import {
  hasPaidSubscription,
  isProfessionalProfile,
  isSettingsPlanStale,
  parseCheckoutStatus,
  profileClientsCount,
} from './settingsProfile';

const BASE_PROFILE: SettingsProfile = {
  name: 'Ana',
  email: 'ana@example.test',
  phone: '',
  birthDate: '',
  address: {
    addressLine1: '',
    addressLine2: '',
    district: '',
    city: '',
    region: '',
    postalCode: '',
  },
};

function profile(overrides: Partial<SettingsProfile> = {}): SettingsProfile {
  return { ...BASE_PROFILE, ...overrides };
}

function isPaid(subscriptionStatus: string | null | undefined): boolean {
  return hasPaidSubscription(profile({ subscriptionStatus }));
}

function isProfessional(productType: string | null): boolean {
  return isProfessionalProfile(profile({ productType }));
}

describe('refactor — settingsProfile status checks', () => {
  // UT-007: ACTIVE_STATUSES check
  it('counts active, trialing and past_due as a paid subscription', () => {
    expect(isPaid('active')).toBe(true);
    expect(isPaid('trialing')).toBe(true);
    expect(isPaid('past_due')).toBe(true);
    expect(isPaid('canceled')).toBe(false);
    expect(isPaid('incomplete')).toBe(false);
    expect(isPaid(null)).toBe(false);
    expect(isPaid(undefined)).toBe(false);
  });

  // UT-007: PROFESSIONAL_TYPES check
  it('treats only nutritionists and physical educators as professionals', () => {
    expect(isProfessional('NUTRITIONIST')).toBe(true);
    expect(isProfessional('PHYSICAL_EDUCATOR')).toBe(true);
    expect(isProfessional('USER')).toBe(false);
    expect(isProfessional(null)).toBe(false);
  });

  // UT-007 / UT-005
  it('keeps a numeric clients count and maps a missing one to null', () => {
    expect(profileClientsCount(profile({ clientsCount: 0 }))).toBe(0);
    expect(profileClientsCount(profile({ clientsCount: 3 }))).toBe(3);
    expect(profileClientsCount(profile())).toBeNull();
    expect(profileClientsCount(profile({ clientsCount: null }))).toBeNull();
  });

  // UT-160 (ADR-010): the checkout query param is now a plain status marker,
  // not a retrievable session id — only the literal "success" counts.
  it('reads only the literal "success" checkout status', () => {
    expect(parseCheckoutStatus('success')).toBe(true);
    expect(parseCheckoutStatus('canceled')).toBe(false);
    expect(parseCheckoutStatus(['success', 'success'])).toBe(false);
    expect(parseCheckoutStatus(undefined)).toBe(false);
  });
});

describe('refactor — settingsProfile plan staleness', () => {
  // UT-007: staleness computation
  it('marks the session plan stale when the product differs', () => {
    const current = profile({ productId: 'premium' });
    const noCheckout = { justCheckedOut: false };

    expect(
      isSettingsPlanStale({
        sessionProductId: 'free',
        profile: current,
        ...noCheckout,
      })
    ).toBe(true);
    expect(
      isSettingsPlanStale({
        sessionProductId: 'premium',
        profile: current,
        ...noCheckout,
      })
    ).toBe(false);
    expect(
      isSettingsPlanStale({
        sessionProductId: undefined,
        profile: profile({ productId: null }),
        ...noCheckout,
      })
    ).toBe(false);
  });

  // UT-007 / UT-005 / UT-160
  it('refreshes after checkout, but never without a profile', () => {
    expect(
      isSettingsPlanStale({
        sessionProductId: 'premium',
        profile: profile({ productId: 'premium' }),
        justCheckedOut: true,
      })
    ).toBe(true);
    expect(
      isSettingsPlanStale({
        sessionProductId: 'free',
        profile: null,
        justCheckedOut: true,
      })
    ).toBe(false);
  });
});
