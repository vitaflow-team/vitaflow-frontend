import 'server-only';

import { APP_ROUTES } from '@/_constants/routes';
import { ACCESS_DENIED_CODE, ACCESS_NOTICE_PARAM } from '@/_lib/accessNotice';
import { fetchPlanClaims } from '@/_lib/fetchPlanClaims';
import { canAccess } from '@/_lib/routeAccess';
import { toSafeActionError } from '@/_lib/safeActionError';
import { redirect, unstable_rethrow } from 'next/navigation';
import { ZSAError } from 'zsa';

export const STUDENTS_ROUTE = '/restrict/students';
export const STUDENTS_ACCESS_DENIED =
  'Esta área não está disponível para o seu tipo de conta.';

/**
 * Re-checks, where the educator's student data is served, that the caller is
 * a physical educator. The type comes from the backend profile, not from the
 * session JWT (frozen at login); who counts is the same route table the
 * middleware reads.
 */
export async function assertEducator(): Promise<void> {
  let productType: string | null;
  try {
    ({ productType } = await fetchPlanClaims());
  } catch (error) {
    unstable_rethrow(error);
    throw toSafeActionError('assertEducator', error);
  }

  if (!canAccess(STUDENTS_ROUTE, productType)) {
    throw new ZSAError('NOT_AUTHORIZED', STUDENTS_ACCESS_DENIED);
  }
}

/** Page-side variant: anyone else lands on the home with the usual notice. */
export async function redirectUnlessEducator(): Promise<void> {
  const allowed = await assertEducator().then(
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
