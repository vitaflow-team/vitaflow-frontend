'use server';

import { WORKOUT_WRITE_ERRORS } from '@/_constants/workoutErrors';
import { apiClient } from '@/_lib/apiClient';
import { requireEducatorSession } from '@/_lib/educatorSession';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { createWorkoutSchema } from '@/_schema/educatorWorkouts';
import type { WorkoutTree } from '@/_types/educatorWorkouts';
import { z } from 'zod';
import { createServerAction } from 'zsa';

export const createWorkout = createServerAction()
  .input(createWorkoutSchema.extend({ studentId: z.string() }))
  .handler(async ({ input }): Promise<WorkoutTree> => {
    await requireEducatorSession();
    const { studentId, ...values } = input;
    const id = parseBackendId(studentId);

    try {
      return await apiClient<WorkoutTree>(`/educator/students/${id}/workouts`, {
        method: 'POST',
        body: JSON.stringify(values),
      });
    } catch (error) {
      throw toSafeActionError('createWorkout', error, WORKOUT_WRITE_ERRORS);
    }
  });
