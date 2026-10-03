'use server';

import { WORKOUT_WRITE_ERRORS } from '@/_constants/workoutErrors';
import { apiClient } from '@/_lib/apiClient';
import { requireEducatorSession } from '@/_lib/educatorSession';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import type { ExerciseContraindication } from '@/_types/exerciseContraindication';
import { z } from 'zod';
import { createServerAction } from 'zsa';

export interface ConflictsResult {
  conflicts: Record<string, ExerciseContraindication[]>;
}

/**
 * Which of the student's restrictions the given library exercises run into.
 * Only what intersects comes back; a failure just means no warning is shown.
 */
export const checkWorkoutConflicts = createServerAction()
  .input(
    z.object({
      studentId: z.string(),
      exerciseIds: z.array(z.string()).min(1).max(100),
    })
  )
  .handler(async ({ input }): Promise<ConflictsResult> => {
    await requireEducatorSession();
    const student = parseBackendId(input.studentId);
    const exerciseIds = input.exerciseIds.map(parseBackendId);

    try {
      return await apiClient<ConflictsResult>(
        `/educator/students/${student}/workouts/conflicts`,
        { method: 'POST', body: JSON.stringify({ exerciseIds }) }
      );
    } catch (error) {
      throw toSafeActionError(
        'checkWorkoutConflicts',
        error,
        WORKOUT_WRITE_ERRORS
      );
    }
  });
