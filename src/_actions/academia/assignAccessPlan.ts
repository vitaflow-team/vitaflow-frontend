'use server';

import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { parseAcademiaId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { z } from 'zod';
import { ZSAError, createServerAction } from 'zsa';

export const assignAccessPlan = createServerAction()
  .input(z.object({ clientId: z.string(), accessPlanId: z.string() }))
  .handler(async ({ input: { clientId, accessPlanId } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();
    const id = parseAcademiaId(clientId);

    try {
      await apiClient(`/academia/students/${id}/access-plan`, {
        method: 'POST',
        body: JSON.stringify({ accessPlanId }),
      });
    } catch (error) {
      throw toSafeActionError('assignAccessPlan', error);
    }
  });
