'use server';

import { apiClient } from '@/_lib/apiClient';
import { toExercisePayload } from '@/_lib/exercisePayload';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { exerciseUpdateSchema } from '@/_schema/exerciseCatalog';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { BACKOFFICE_ERRORS, INVALID_EXERCISE } from './backofficeErrors';

/** Backoffice direct edit of any field; users see it on their next visit. */
export const updateExercise = createServerAction()
  .input(exerciseUpdateSchema)
  .handler(async ({ input: { id, ...values } }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const exerciseId = parseBackendId(id);

    try {
      await apiClient(`/admin/exercises/${exerciseId}`, {
        method: 'PATCH',
        body: JSON.stringify(toExercisePayload(values)),
      });
    } catch (error) {
      throw toSafeActionError('updateExercise', error, [
        INVALID_EXERCISE,
        ...BACKOFFICE_ERRORS,
      ]);
    }
  });
