'use server';

import { WORKOUT_WRITE_ERRORS } from '@/_constants/workoutErrors';
import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import { isBackendError } from '@/_lib/backendError';
import { requireEducatorSession } from '@/_lib/educatorSession';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import type { ActivationProblem, WorkoutTree } from '@/_types/educatorWorkouts';
import type { ActivateWorkoutOutcome } from '@/_types/workoutOutcomes';
import { z } from 'zod';
import { createServerAction } from 'zsa';

function problemsOf(error: unknown): ActivationProblem[] {
  const details = error instanceof AppError ? error.details : undefined;
  return Array.isArray(details) ? (details as ActivationProblem[]) : [];
}

/**
 * Activating needs a session with an exercise in each; when the backend refuses
 * (422) the sessions that lack one come back so the educator can fix them.
 */
export const activateWorkout = createServerAction()
  .input(z.object({ studentId: z.string(), workoutId: z.string() }))
  .handler(async ({ input }): Promise<ActivateWorkoutOutcome> => {
    await requireEducatorSession();
    const student = parseBackendId(input.studentId);
    const workout = parseBackendId(input.workoutId);

    try {
      const activated = await apiClient<WorkoutTree>(
        `/educator/students/${student}/workouts/${workout}/activate`,
        { method: 'POST' }
      );
      return { outcome: 'activated', workout: activated };
    } catch (error) {
      if (isBackendError(error, 422, 'workout_not_activatable')) {
        return { outcome: 'not_activatable', problems: problemsOf(error) };
      }
      if (isBackendError(error, 404)) return { outcome: 'not_found' };
      throw toSafeActionError('activateWorkout', error, WORKOUT_WRITE_ERRORS);
    }
  });
