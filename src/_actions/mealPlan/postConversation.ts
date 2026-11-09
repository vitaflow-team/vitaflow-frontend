'use server';

import { apiClient } from '@/_lib/apiClient';
import { assertNutritionist } from '@/_lib/patientsAuthorization';
import { TOO_MANY_REQUESTS, toSafeActionError } from '@/_lib/safeActionError';
import {
  CONFIRM_OVERWRITE_REQUIRED,
  INVALID_ANSWER,
  LLM_CALL_FAILED,
  PREMIUM_REQUIRED,
} from '@/_lib/mealPlanGenerationErrors';
import { mealPlanConversationSchema } from '@/_schema/mealPlan';
import type { MealPlanConversationOrDraft } from '@/_types/mealPlan';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

/**
 * The meal-plan-generation counterpart of `_actions/workouts/postConversation.ts`
 * — same shape (empty input starts the intake, `conversationId`+`answer`
 * advances it), plus `clientId` (this action operates on a nutritionist's
 * client, not the caller's own record) and `confirmOverwrite` (read only on
 * the start call, per ADR-013). Authorization also adds `assertNutritionist()`,
 * matching this feature's sibling actions (`cloneDay`, `saveDay`,
 * `publishMealPlan`) rather than workout's bare session check, since the
 * backend route requires `ProfessionalGuard`/`assertOwnedClient()`.
 */
export const postMealPlanConversation = createServerAction()
  .input(mealPlanConversationSchema)
  .handler(async ({ input }): Promise<MealPlanConversationOrDraft> => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    await assertNutritionist();

    try {
      return await apiClient<MealPlanConversationOrDraft>(
        `/professionals/clients/${input.clientId}/meal-plan/generation/conversation`,
        {
          method: 'POST',
          body: JSON.stringify({
            conversationId: input.conversationId,
            answer: input.answer,
            ...(input.confirmOverwrite ? { confirmOverwrite: true } : {}),
          }),
        }
      );
    } catch (error) {
      throw toSafeActionError('postMealPlanConversation', error, [
        CONFIRM_OVERWRITE_REQUIRED,
        PREMIUM_REQUIRED,
        INVALID_ANSWER,
        LLM_CALL_FAILED,
        TOO_MANY_REQUESTS,
      ]);
    }
  });
