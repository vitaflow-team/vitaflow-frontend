'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { exerciseIdSchema } from '@/_schema/exerciseCatalog';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { BACKOFFICE_ERRORS } from './backofficeErrors';

/** Removes an exercise from the catalog for good (US-010.AC-3). */
export const deleteExercise = createServerAction()
  .input(exerciseIdSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const exerciseId = parseBackendId(input.id);

    try {
      await apiClient(`/admin/exercises/${exerciseId}`, { method: 'DELETE' });
    } catch (error) {
      throw toSafeActionError('deleteExercise', error, BACKOFFICE_ERRORS);
    }
  });
