'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { exerciseIdSchema } from '@/_schema/exerciseCatalog';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { ALREADY_REVIEWED, BACKOFFICE_ERRORS } from './backofficeErrors';

/** Publishes a pending educator submission (US-008). */
export const approveExercise = createServerAction()
  .input(exerciseIdSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const exerciseId = parseBackendId(input.id);

    try {
      await apiClient(`/admin/exercises/${exerciseId}/approve`, {
        method: 'POST',
      });
    } catch (error) {
      throw toSafeActionError('approveExercise', error, [
        ALREADY_REVIEWED,
        ...BACKOFFICE_ERRORS,
      ]);
    }
  });
