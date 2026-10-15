import 'server-only';

import { APP_ROUTES } from '@/_constants/routes';
import { ACCESS_DENIED_CODE, ACCESS_NOTICE_PARAM } from '@/_lib/accessNotice';
import { RECEPTIONIST_ACCOUNT_TYPE } from '@/_lib/accountType';
import { fetchPlanClaims } from '@/_lib/fetchPlanClaims';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { redirect, unstable_rethrow } from 'next/navigation';
import { ZSAError } from 'zsa';

export const ACADEMIA_ACCESS_DENIED =
  'Esta área não está disponível para o seu tipo de conta.';

export async function assertAcademiaOwner(): Promise<void> {
  let productType: string | null;
  try {
    ({ productType } = await fetchPlanClaims());
  } catch (error) {
    unstable_rethrow(error);
    throw toSafeActionError('assertAcademiaOwner', error);
  }

  if (productType !== 'ACADEMIA') {
    throw new ZSAError('NOT_AUTHORIZED', ACADEMIA_ACCESS_DENIED);
  }
}

export async function redirectUnlessAcademiaOwner(): Promise<void> {
  const allowed = await assertAcademiaOwner().then(
    () => true,
    error => {
      unstable_rethrow(error);
      return false;
    }
  );
  if (!allowed) redirectToDeniedHome();
}

export async function redirectUnlessReceptionist(): Promise<void> {
  const session = await auth();
  if (session?.user?.role !== RECEPTIONIST_ACCOUNT_TYPE) redirectToDeniedHome();
}

export async function redirectIfReceptionist(): Promise<void> {
  const session = await auth();
  if (session?.user?.role === RECEPTIONIST_ACCOUNT_TYPE) redirectToDeniedHome();
}

function redirectToDeniedHome(): never {
  redirect(
    `${APP_ROUTES.ROUTE_PRIVATE}?${ACCESS_NOTICE_PARAM}=${ACCESS_DENIED_CODE}`
  );
}
