'use server';

import { WORKOUT_WRITE_ERRORS } from '@/_constants/workoutErrors';
import { DUPLICATE_TARGETS_MAX } from '@/_constants/educatorWorkoutLimits';
import { apiClient } from '@/_lib/apiClient';
import { requireEducatorSession } from '@/_lib/educatorSession';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { z } from 'zod';
import { createServerAction } from 'zsa';

const duplicateSchema = z.object({
  studentId: z.string(),
  workoutId: z.string(),
  studentIds: z.array(z.string()).min(1).max(DUPLICATE_TARGETS_MAX),
});

export interface DuplicateResult {
  copies: Array<{ studentId: string; workoutId: string }>;
}

/** Copies the workout to 1 to 20 of the educator's students as drafts. */
export const duplicateWorkout = createServerAction()
  .input(duplicateSchema)
  .handler(async ({ input }): Promise<DuplicateResult> => {
    await requireEducatorSession();
    const student = parseBackendId(input.studentId);
    const workout = parseBackendId(input.workoutId);
    const studentIds = input.studentIds.map(parseBackendId);

    try {
      return await apiClient<DuplicateResult>(
        `/educator/students/${student}/workouts/${workout}/duplicate`,
        { method: 'POST', body: JSON.stringify({ studentIds }) }
      );
    } catch (error) {
      throw toSafeActionError('duplicateWorkout', error, WORKOUT_WRITE_ERRORS);
    }
  });
