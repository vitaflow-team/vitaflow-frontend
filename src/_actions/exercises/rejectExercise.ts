'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { exerciseRejectSchema } from '@/_schema/exerciseCatalog';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import {
  ALREADY_REVIEWED,
  BACKOFFICE_ERRORS,
  INVALID_EXERCISE,
} from './backofficeErrors';

/**
 * Turns down a pending submission. A blank reason is left out, so the
 * educator sees a plain "rejected" and no empty reason (US-007.EC-2).
 */
export const rejectExercise = createServerAction()
  .input(exerciseRejectSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const exerciseId = parseBackendId(input.id);
    const body = input.reason ? { reason: input.reason } : {};

    try {
      await apiClient(`/admin/exercises/${exerciseId}/reject`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
    } catch (error) {
      throw toSafeActionError('rejectExercise', error, [
        ALREADY_REVIEWED,
        INVALID_EXERCISE,
        ...BACKOFFICE_ERRORS,
      ]);
    }
  });
