'use server';

import { apiClient } from '@/_lib/apiClient';
import { WORKOUT_AI_GENERATION_ERRORS } from '@/_lib/educatorAiWorkoutGenerationErrors';
import { requireEducatorSession } from '@/_lib/educatorSession';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { educatorAiWorkoutConversationSchema } from '@/_schema/educatorWorkouts';
import type { EducatorAiWorkoutConversationOrTree } from '@/_types/educatorAiWorkout';
import type { WorkoutTree } from '@/_types/educatorWorkouts';
import { createServerAction } from 'zsa';

/** The backend's own turn shape — has no `optional` field, since this
 * feature's 5-question intake has nothing skippable. */
interface BackendAiWorkoutTurn {
  conversationId: string;
  question: string;
  reprompt: boolean;
}

/**
 * The AI-workout-generation counterpart of `createWorkout.ts` crossed with
 * meal plan's `postConversation.ts`: `requireEducatorSession()` +
 * `parseBackendId` (this action operates on an educator's student, unlike
 * the B2C `_actions/workouts/postConversation.ts`'s bare session check) to
 * reach `POST .../workouts/ai-generation/conversation`, adapting the
 * backend's turn shape down to `EducatorAiWorkoutConversationTurn`
 * (`ConversationTurnLike`-compatible) so the shared, generic
 * `ConversationChat` can drive it unmodified.
 */
export const postEducatorAiWorkoutConversation = createServerAction()
  .input(educatorAiWorkoutConversationSchema)
  .handler(async ({ input }): Promise<EducatorAiWorkoutConversationOrTree> => {
    await requireEducatorSession();
    const { studentId, workoutId, ...body } = input;
    const id = parseBackendId(studentId);

    try {
      const result = await apiClient<WorkoutTree | BackendAiWorkoutTurn>(
        `/educator/students/${id}/workouts/ai-generation/conversation`,
        {
          method: 'POST',
          body: JSON.stringify({
            ...body,
            ...(workoutId ? { workoutId: parseBackendId(workoutId) } : {}),
          }),
        }
      );
      if ('sessions' in result) return result;
      return {
        conversationId: result.conversationId,
        question: result.question,
        reprompt: result.reprompt,
        optional: false,
      };
    } catch (error) {
      throw toSafeActionError(
        'postEducatorAiWorkoutConversation',
        error,
        WORKOUT_AI_GENERATION_ERRORS
      );
    }
  });
