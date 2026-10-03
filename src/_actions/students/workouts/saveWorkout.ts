'use server';

import { WORKOUT_WRITE_ERRORS } from '@/_constants/workoutErrors';
import { apiClient } from '@/_lib/apiClient';
import { isBackendError } from '@/_lib/backendError';
import { requireEducatorSession } from '@/_lib/educatorSession';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { workoutSchema } from '@/_schema/educatorWorkouts';
import type { WorkoutTree } from '@/_types/educatorWorkouts';
import type { SaveWorkoutOutcome } from '@/_types/workoutOutcomes';
import { z } from 'zod';
import { createServerAction } from 'zsa';

const saveInputSchema = workoutSchema.extend({
  studentId: z.string(),
  workoutId: z.string(),
});

/**
 * Saves the whole workout in one request. A 422 on the active workout, and a
 * student or workout that is gone, are outcomes the editor reacts to without
 * losing what was typed; everything else is a safe error message.
 */
export const saveWorkout = createServerAction()
  .input(saveInputSchema)
  .handler(async ({ input }): Promise<SaveWorkoutOutcome> => {
    await requireEducatorSession();
    const { studentId, workoutId, ...tree } = input;
    const student = parseBackendId(studentId);
    const workout = parseBackendId(workoutId);

    try {
      const saved = await apiClient<WorkoutTree>(
        `/educator/students/${student}/workouts/${workout}`,
        { method: 'PUT', body: JSON.stringify(tree) }
      );
      return { outcome: 'saved', workout: saved };
    } catch (error) {
      if (isBackendError(error, 422, 'workout_active_invalid')) {
        return { outcome: 'active_invalid' };
      }
      if (isBackendError(error, 404)) return { outcome: 'not_found' };
      throw toSafeActionError('saveWorkout', error, WORKOUT_WRITE_ERRORS);
    }
  });
