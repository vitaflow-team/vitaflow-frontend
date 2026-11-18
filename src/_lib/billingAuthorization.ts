import 'server-only';

import { APP_ROUTES } from '@/_constants/routes';
import { ACCESS_DENIED_CODE, ACCESS_NOTICE_PARAM } from '@/_lib/accessNotice';
import { isBillingOwnerType } from '@/_lib/billingOwnerType';
import { fetchPlanClaims } from '@/_lib/fetchPlanClaims';
import { toSafeActionError } from '@/_lib/safeActionError';
import { redirect, unstable_rethrow } from 'next/navigation';
import { ZSAError } from 'zsa';

export const BILLING_ACCESS_DENIED =
  'Esta área não está disponível para o seu tipo de conta.';

const PROFESSIONAL_TYPES = new Set(['NUTRITIONIST', 'PHYSICAL_EDUCATOR']);

async function fetchProductType(source: string): Promise<string | null> {
  try {
    return (await fetchPlanClaims()).productType;
  } catch (error) {
    unstable_rethrow(error);
    throw toSafeActionError(source, error);
  }
}

// Billing serves both professions (ADR-004), unlike the single-profession
// route table `canAccess` reads from — checked directly against the
// server's own profile, not the session (frozen at login, ADR-008).
export async function assertProfessional(): Promise<void> {
  const productType = await fetchProductType('assertProfessional');
  if (!PROFESSIONAL_TYPES.has(productType ?? '')) {
    throw new ZSAError('NOT_AUTHORIZED', BILLING_ACCESS_DENIED);
  }
}

// Whoever can hold a billing account: an independent professional or a gym
// owner (ADR-008). Manual invoice creation and editing stay professional-only
// (`assertProfessional`); gym fees come from the recurrence.
export async function assertBillingOwner(): Promise<void> {
  const productType = await fetchProductType('assertBillingOwner');
  if (!isBillingOwnerType(productType)) {
    throw new ZSAError('NOT_AUTHORIZED', BILLING_ACCESS_DENIED);
  }
}

async function redirectUnless(assert: () => Promise<void>): Promise<void> {
  const allowed = await assert().then(
    () => true,
    error => {
      unstable_rethrow(error);
      return false;
    }
  );
  if (!allowed) {
    redirect(
      `${APP_ROUTES.ROUTE_PRIVATE}?${ACCESS_NOTICE_PARAM}=${ACCESS_DENIED_CODE}`
    );
  }
}

export async function redirectUnlessProfessional(): Promise<void> {
  await redirectUnless(assertProfessional);
}

export async function redirectUnlessBillingOwner(): Promise<void> {
  await redirectUnless(assertBillingOwner);
}
