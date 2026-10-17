'use server';

import { MEAL_PLAN_ERRORS } from '@/_constants/mealPlanErrors';
import { apiClient } from '@/_lib/apiClient';
import { isBackendError } from '@/_lib/backendError';
import { assertNutritionist } from '@/_lib/patientsAuthorization';
import { TOO_MANY_REQUESTS, toSafeActionError } from '@/_lib/safeActionError';
import { cloneDaySchema } from '@/_schema/mealPlan';
import type { MealPlanDraft } from '@/_types/mealPlan';
import type { CloneDayOutcome } from '@/_types/cloneDayOutcome';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

/**
 * A target day that already has meals surfaces as a typed outcome, not an
 * error: the caller shows an overwrite confirmation and resends with
 * `confirmOverwrite: true` rather than treating it as a failure.
 */
export const cloneDay = createServerAction()
  .input(cloneDaySchema)
  .handler(async ({ input }): Promise<CloneDayOutcome> => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    await assertNutritionist();

    try {
      const draft = await apiClient<MealPlanDraft>(
        `/professionals/clients/${input.clientId}/meal-plan/draft/days/${input.weekday}/clone`,
        {
          method: 'POST',
          body: JSON.stringify({
            sourceDayId: input.sourceDayId,
            ...(input.confirmOverwrite ? { confirmOverwrite: true } : {}),
          }),
        }
      );
      return { outcome: 'cloned', draft };
    } catch (error) {
      if (isBackendError(error, 409, 'confirm_overwrite_required')) {
        return { outcome: 'confirm_overwrite_required' };
      }
      throw toSafeActionError('cloneDay', error, [
        ...MEAL_PLAN_ERRORS,
        TOO_MANY_REQUESTS,
      ]);
    }
  });
