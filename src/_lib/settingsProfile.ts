import { isSessionPlanStale } from '@/_lib/sessionPlan';
import type { SettingsProfile } from '@/_types/settingsProfile';

/** Subscription statuses that still count as a paid subscription. */
const ACTIVE_STATUSES = ['active', 'trialing', 'past_due'];

const PROFESSIONAL_TYPES = ['NUTRITIONIST', 'PHYSICAL_EDUCATOR'];

export function hasPaidSubscription(profile: SettingsProfile): boolean {
  return ACTIVE_STATUSES.includes(profile.subscriptionStatus ?? '');
}

/**
 * Read from the freshly loaded profile, not the session: right after a plan
 * change the session still carries the old type (ADR-008).
 */
export function isProfessionalProfile(profile: SettingsProfile): boolean {
  return PROFESSIONAL_TYPES.includes(profile.productType ?? '');
}

/**
 * `undefined` (older backend or missing field) becomes `null`, so the UI can
 * tell "no students" apart from "could not count".
 */
export function profileClientsCount(profile: SettingsProfile): number | null {
  return typeof profile.clientsCount === 'number' ? profile.clientsCount : null;
}

/** `?checkout=success` marks a return from the Asaas checkout page (ADR-010). */
export function parseCheckoutStatus(
  value: string | string[] | undefined
): boolean {
  return value === 'success';
}

interface SettingsPlanStaleInput {
  sessionProductId: string | null | undefined;
  profile: SettingsProfile | null;
  justCheckedOut: boolean;
}

/**
 * The session freezes the plan at sign-in; the profile is the server's truth.
 * Returning from checkout counts too: the webhook may have just landed, or be
 * about to (ADR-010 — there is no client-side optimistic sync to run first,
 * unlike the Stripe-era flow). Without a profile nothing is refreshed.
 */
export function isSettingsPlanStale({
  sessionProductId,
  profile,
  justCheckedOut,
}: SettingsPlanStaleInput): boolean {
  if (!profile) return false;

  return (
    isSessionPlanStale(
      { productId: sessionProductId },
      { productId: profile.productId }
    ) || justCheckedOut
  );
}
