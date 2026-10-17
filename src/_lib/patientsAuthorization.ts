import 'server-only';

import { APP_ROUTES } from '@/_constants/routes';
import { ACCESS_DENIED_CODE, ACCESS_NOTICE_PARAM } from '@/_lib/accessNotice';
import { fetchPlanClaims } from '@/_lib/fetchPlanClaims';
import { canAccess } from '@/_lib/routeAccess';
import { toSafeActionError } from '@/_lib/safeActionError';
import { redirect, unstable_rethrow } from 'next/navigation';
import { ZSAError } from 'zsa';

export const PATIENTS_ROUTE = '/restrict/patients';
export const PATIENTS_ACCESS_DENIED =
  'Esta área não está disponível para o seu tipo de conta.';

/**
 * Re-checks, where the nutritionist's patient data is served, that the
 * caller is a nutritionist. The type comes from the backend profile, not
 * from the session JWT (frozen at login) — mirrors assertEducator.
 */
export async function assertNutritionist(): Promise<void> {
  let productType: string | null;
  try {
    ({ productType } = await fetchPlanClaims());
  } catch (error) {
    unstable_rethrow(error);
    throw toSafeActionError('assertNutritionist', error);
  }

  if (!canAccess(PATIENTS_ROUTE, productType)) {
    throw new ZSAError('NOT_AUTHORIZED', PATIENTS_ACCESS_DENIED);
  }
}

/** Page-side variant: anyone else lands on the home with the usual notice. */
export async function redirectUnlessNutritionist(): Promise<void> {
  const allowed = await assertNutritionist().then(
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
