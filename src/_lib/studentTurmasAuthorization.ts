import 'server-only';

import { APP_ROUTES } from '@/_constants/routes';
import { ACCESS_DENIED_CODE, ACCESS_NOTICE_PARAM } from '@/_lib/accessNotice';
import { fetchPlanClaims } from '@/_lib/fetchPlanClaims';
import { canAccess } from '@/_lib/routeAccess';
import { redirect, unstable_rethrow } from 'next/navigation';

export const STUDENT_TURMAS_ROUTE = '/restrict/turmas';

/** Page-side: anyone but a USER account lands on the home with the usual notice. */
export async function redirectUnlessGymStudentAccount(): Promise<void> {
  let allowed: boolean;
  try {
    const { productType } = await fetchPlanClaims();
    allowed = canAccess(STUDENT_TURMAS_ROUTE, productType);
  } catch (error) {
    unstable_rethrow(error);
    allowed = false;
  }

  if (!allowed) {
    redirect(
      `${APP_ROUTES.ROUTE_PRIVATE}?${ACCESS_NOTICE_PARAM}=${ACCESS_DENIED_CODE}`
    );
  }
}
