'use server';

import { apiClient } from '@/_lib/apiClient';
import { toExercisePayload } from '@/_lib/exercisePayload';
import { toSafeActionError } from '@/_lib/safeActionError';
import { exerciseCatalogSchema } from '@/_schema/exerciseCatalog';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { BACKOFFICE_ERRORS, INVALID_EXERCISE } from './backofficeErrors';

/** Backoffice direct create: published at once, no review step (US-010). */
export const createExercise = createServerAction()
  .input(exerciseCatalogSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      await apiClient('/admin/exercises', {
        method: 'POST',
        body: JSON.stringify(toExercisePayload(input)),
      });
    } catch (error) {
      throw toSafeActionError('createExercise', error, [
        INVALID_EXERCISE,
        ...BACKOFFICE_ERRORS,
      ]);
    }
  });
