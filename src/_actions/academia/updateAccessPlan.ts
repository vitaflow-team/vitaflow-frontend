'use server';

import { ACCESS_PLAN_WRITE_ERRORS } from '@/_constants/academiaErrors';
import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { parseAcademiaId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { accessPlanSchema } from '@/_schema/academia';
import { auth } from '@/auth';
import { z } from 'zod';
import { ZSAError, createServerAction } from 'zsa';

export const updateAccessPlan = createServerAction()
  .input(accessPlanSchema.and(z.object({ id: z.string() })))
  .handler(async ({ input: { id, ...patch } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();
    const planId = parseAcademiaId(id);

    try {
      await apiClient(`/academia/access-plans/${planId}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      });
    } catch (error) {
      throw toSafeActionError(
        'updateAccessPlan',
        error,
        ACCESS_PLAN_WRITE_ERRORS
      );
    }
  });
