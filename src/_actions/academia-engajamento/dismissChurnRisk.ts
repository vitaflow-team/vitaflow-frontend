'use server';

import { CHURN_RISK_DISMISS_ERRORS } from '@/_constants/academiaErrors';
import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { parseAcademiaId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { z } from 'zod';
import { ZSAError, createServerAction } from 'zsa';

export const dismissChurnRisk = createServerAction()
  .input(z.object({ clientId: z.string() }))
  .handler(async ({ input: { clientId } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();
    const id = parseAcademiaId(clientId);

    try {
      await apiClient(`/academia/churn-risk/${id}/dismiss`, {
        method: 'POST',
      });
    } catch (error) {
      throw toSafeActionError(
        'dismissChurnRisk',
        error,
        CHURN_RISK_DISMISS_ERRORS
      );
    }
  });
