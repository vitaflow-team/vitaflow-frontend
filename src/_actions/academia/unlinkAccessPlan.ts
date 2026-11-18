'use server';

import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { toBillingActionError } from '@/_lib/billingActionError';
import { parseAcademiaId } from '@/_lib/idValidation';
import { auth } from '@/auth';
import { z } from 'zod';
import { ZSAError, createServerAction } from 'zsa';

/** Archives the plan, ends the monthly billing and cancels fees not yet due. */
export const unlinkAccessPlan = createServerAction()
  .input(z.object({ clientId: z.string() }))
  .handler(async ({ input: { clientId } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();
    const id = parseAcademiaId(clientId);

    try {
      await apiClient(`/academia/students/${id}/access-plan`, {
        method: 'DELETE',
      });
    } catch (error) {
      throw toBillingActionError('unlinkAccessPlan', error);
    }
  });
