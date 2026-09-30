'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { conversationAnswerSchema } from '@/_schema/workout';
import type { ConversationOrWorkout } from '@/_types/workout';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import {
  INVALID_ANSWER,
  NOT_ENOUGH_EXERCISES,
  PREMIUM_REQUIRED,
} from './workoutErrors';

/** Starts a new conversation (empty body) or continues one (conversationId
 * + the free-text answer to the previous question). The response is the
 * next question, or — on the turn that completes the intake — the freshly
 * generated workout itself (see `isGeneratedWorkout`). */
export const actionPostConversation = createServerAction()
  .input(conversationAnswerSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      return await apiClient<ConversationOrWorkout>('/workouts/conversation', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } catch (error) {
      throw toSafeActionError('postConversation', error, [
        INVALID_ANSWER,
        PREMIUM_REQUIRED,
        NOT_ENOUGH_EXERCISES,
      ]);
    }
  });
