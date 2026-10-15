'use server';

import { ACCESS_PLAN_WRITE_ERRORS } from '@/_constants/academiaErrors';
import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { accessPlanSchema } from '@/_schema/academia';
import { auth } from '@/auth';
import { ZSAError, createServerAction } from 'zsa';

export const createAccessPlan = createServerAction()
  .input(accessPlanSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();

    try {
      await apiClient('/academia/access-plans', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } catch (error) {
      throw toSafeActionError(
        'createAccessPlan',
        error,
        ACCESS_PLAN_WRITE_ERRORS
      );
    }
  });
