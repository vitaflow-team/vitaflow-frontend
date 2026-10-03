'use server';

import { WORKOUT_WRITE_ERRORS } from '@/_constants/workoutErrors';
import { apiClient } from '@/_lib/apiClient';
import { isBackendError } from '@/_lib/backendError';
import { requireEducatorSession } from '@/_lib/educatorSession';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { z } from 'zod';
import { createServerAction } from 'zsa';

/**
 * Deletes a draft or archived workout. A 404 means it is already gone, so it
 * succeeds; the active workout is refused by the backend (409) with a message.
 */
export const deleteWorkout = createServerAction()
  .input(z.object({ studentId: z.string(), workoutId: z.string() }))
  .handler(async ({ input }) => {
    await requireEducatorSession();
    const student = parseBackendId(input.studentId);
    const workout = parseBackendId(input.workoutId);

    try {
      await apiClient(`/educator/students/${student}/workouts/${workout}`, {
        method: 'DELETE',
      });
    } catch (error) {
      if (isBackendError(error, 404)) return;
      throw toSafeActionError('deleteWorkout', error, WORKOUT_WRITE_ERRORS);
    }
  });
