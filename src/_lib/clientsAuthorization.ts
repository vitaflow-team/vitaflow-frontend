import 'server-only';

import { APP_ROUTES } from '@/_constants/routes';
import { ACCESS_DENIED_CODE, ACCESS_NOTICE_PARAM } from '@/_lib/accessNotice';
import { fetchPlanClaims } from '@/_lib/fetchPlanClaims';
import { canAccess } from '@/_lib/routeAccess';
import { toSafeActionError } from '@/_lib/safeActionError';
import { redirect, unstable_rethrow } from 'next/navigation';
import { ZSAError } from 'zsa';

const CLIENTS_ROUTE = '/restrict/clients';
export const CLIENTS_ACCESS_DENIED =
  'Esta área não está disponível para o seu tipo de conta.';

/**
 * Re-checks, at the layer that serves client data, that the caller is a
 * professional. The type comes from the backend profile, not from the session
 * JWT, which is frozen at login (ADR-003); who counts as a professional is the
 * same route table the middleware reads.
 */
export async function assertProfessional(): Promise<void> {
  let productType: string | null;
  try {
    ({ productType } = await fetchPlanClaims());
  } catch (error) {
    // Next's own control-flow errors (dynamic rendering bailout, redirects)
    // must reach Next, not become a failed check.
    unstable_rethrow(error);
    throw toSafeActionError('assertProfessional', error);
  }

  if (!canAccess(CLIENTS_ROUTE, productType)) {
    throw new ZSAError('NOT_AUTHORIZED', CLIENTS_ACCESS_DENIED);
  }
}

/**
 * Page-side variant: a caller who fails the check lands on the restricted
 * home with the same "area unavailable" notice the middleware shows.
 */
export async function redirectUnlessProfessional(): Promise<void> {
  const allowed = await assertProfessional().then(
    () => true,
    error => {
      unstable_rethrow(error);
      return false;
    }
  );
  if (!allowed) {
    // `redirect` throws NEXT_REDIRECT, so it must stay outside any catch.
    redirect(
      `${APP_ROUTES.ROUTE_PRIVATE}?${ACCESS_NOTICE_PARAM}=${ACCESS_DENIED_CODE}`
    );
  }
}
