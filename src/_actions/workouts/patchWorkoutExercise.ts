'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { updateWorkoutExerciseSchema } from '@/_schema/exercise';
import type { Workout } from '@/_types/workout';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { WORKOUT_NOT_FOUND } from './workoutErrors';
import type { ErrorMapping } from '@/_types/errorMapping';

// The backend uses 400 for every rejection this endpoint can produce
// (contraindicated replacement, empty day, invalid sets/reps) — one
// message covers all three since the client can't tell them apart from
// the status code alone (no distinguishing `code` is sent).
const INVALID_EDIT: ErrorMapping = {
  status: 400,
  message:
    'Não foi possível salvar esse exercício. Verifique os valores e as restrições cadastradas.',
};

/** Manual edit of one exercise: swap it, adjust sets/reps, or remove it
 * from its training day (US-008). */
export const actionPatchWorkoutExercise = createServerAction()
  .input(updateWorkoutExerciseSchema)
  .handler(async ({ input: { workoutExerciseId, ...values } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const id = parseBackendId(workoutExerciseId);

    try {
      return await apiClient<Workout>(`/workouts/exercises/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(values),
      });
    } catch (error) {
      throw toSafeActionError('patchWorkoutExercise', error, [
        INVALID_EDIT,
        WORKOUT_NOT_FOUND,
      ]);
    }
  });
