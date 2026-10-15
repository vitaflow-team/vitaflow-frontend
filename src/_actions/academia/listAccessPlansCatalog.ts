'use server';

import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import type { AcademiaAccessPlan } from '@/_types/academia';
import { auth } from '@/auth';
import { ZSAError, createServerAction } from 'zsa';

export const listAccessPlansCatalog = createServerAction().handler(async () => {
  const session = await auth();
  if (!session?.user) {
    throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
  }
  await assertAcademiaOwner();

  try {
    return await apiClient<AcademiaAccessPlan[]>('/academia/access-plans', {
      method: 'GET',
      cache: 'no-store',
    });
  } catch (error) {
    throw toSafeActionError('listAccessPlansCatalog', error);
  }
});
