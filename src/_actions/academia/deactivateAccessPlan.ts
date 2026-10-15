'use server';

import { ACCESS_PLAN_WRITE_ERRORS } from '@/_constants/academiaErrors';
import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { parseAcademiaId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { z } from 'zod';
import { ZSAError, createServerAction } from 'zsa';

export const deactivateAccessPlan = createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();
    const id = parseAcademiaId(input.id);

    try {
      await apiClient(`/academia/access-plans/${id}/deactivate`, {
        method: 'POST',
      });
    } catch (error) {
      throw toSafeActionError(
        'deactivateAccessPlan',
        error,
        ACCESS_PLAN_WRITE_ERRORS
      );
    }
  });
