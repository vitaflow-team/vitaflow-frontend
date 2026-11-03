import 'server-only';

import { APP_ROUTES } from '@/_constants/routes';
import { ACCESS_DENIED_CODE, ACCESS_NOTICE_PARAM } from '@/_lib/accessNotice';
import { fetchPlanClaims } from '@/_lib/fetchPlanClaims';
import { toSafeActionError } from '@/_lib/safeActionError';
import { redirect, unstable_rethrow } from 'next/navigation';
import { ZSAError } from 'zsa';

export const BILLING_ACCESS_DENIED =
  'Esta área não está disponível para o seu tipo de conta.';

const PROFESSIONAL_TYPES = new Set(['NUTRITIONIST', 'PHYSICAL_EDUCATOR']);

// Billing serves both professions (ADR-004), unlike the single-profession
// route table `canAccess` reads from — checked directly against the
// server's own profile, not the session (frozen at login, ADR-008).
export async function assertProfessional(): Promise<void> {
  let productType: string | null;
  try {
    ({ productType } = await fetchPlanClaims());
  } catch (error) {
    unstable_rethrow(error);
    throw toSafeActionError('assertProfessional', error);
  }

  if (!PROFESSIONAL_TYPES.has(productType ?? '')) {
    throw new ZSAError('NOT_AUTHORIZED', BILLING_ACCESS_DENIED);
  }
}

export async function redirectUnlessProfessional(): Promise<void> {
  const allowed = await assertProfessional().then(
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
