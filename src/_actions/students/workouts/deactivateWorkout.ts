'use server';

import { WORKOUT_WRITE_ERRORS } from '@/_constants/workoutErrors';
import { apiClient } from '@/_lib/apiClient';
import { requireEducatorSession } from '@/_lib/educatorSession';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import type { WorkoutTree } from '@/_types/educatorWorkouts';
import { z } from 'zod';
import { createServerAction } from 'zsa';

export const deactivateWorkout = createServerAction()
  .input(z.object({ studentId: z.string(), workoutId: z.string() }))
  .handler(async ({ input }): Promise<WorkoutTree> => {
    await requireEducatorSession();
    const student = parseBackendId(input.studentId);
    const workout = parseBackendId(input.workoutId);

    try {
      return await apiClient<WorkoutTree>(
        `/educator/students/${student}/workouts/${workout}/deactivate`,
        { method: 'POST' }
      );
    } catch (error) {
      throw toSafeActionError('deactivateWorkout', error, WORKOUT_WRITE_ERRORS);
    }
  });
