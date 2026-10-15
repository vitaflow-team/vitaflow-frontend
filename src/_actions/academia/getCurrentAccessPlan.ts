'use server';

import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { parseAcademiaId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import type { CurrentAccessPlan } from '@/_types/studentAccessPlan';
import { auth } from '@/auth';
import { z } from 'zod';
import { ZSAError, createServerAction } from 'zsa';

export const getCurrentAccessPlan = createServerAction()
  .input(z.object({ clientId: z.string() }))
  .handler(async ({ input: { clientId } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();
    const id = parseAcademiaId(clientId);

    try {
      return await apiClient<CurrentAccessPlan>(
        `/academia/students/${id}/access-plan`,
        { method: 'GET', cache: 'no-store' }
      );
    } catch (error) {
      throw toSafeActionError('getCurrentAccessPlan', error);
    }
  });
