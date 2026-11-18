'use server';

import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { toBillingActionError } from '@/_lib/billingActionError';
import type { EligibleStudent } from '@/_types/eligibleStudent';
import { auth } from '@/auth';
import { ZSAError, createServerAction } from 'zsa';

/** Students with an active plan and no monthly billing, with whether a tax ID is on file. */
export const listEligibleStudents = createServerAction().handler(async () => {
  const session = await auth();
  if (!session?.user) {
    throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
  }
  await assertAcademiaOwner();

  try {
    return await apiClient<EligibleStudent[]>(
      '/academia/students/billing/eligible',
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    throw toBillingActionError('listEligibleStudents', error);
  }
});
