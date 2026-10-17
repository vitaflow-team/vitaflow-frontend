'use server';

import { MEAL_PLAN_ERRORS } from '@/_constants/mealPlanErrors';
import { apiClient } from '@/_lib/apiClient';
import { assertNutritionist } from '@/_lib/patientsAuthorization';
import { TOO_MANY_REQUESTS, toSafeActionError } from '@/_lib/safeActionError';
import { saveDaySchema } from '@/_schema/mealPlan';
import type { MealPlanDraft } from '@/_types/mealPlan';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const saveDay = createServerAction()
  .input(saveDaySchema)
  .handler(async ({ input }): Promise<MealPlanDraft> => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    await assertNutritionist();

    try {
      return await apiClient<MealPlanDraft>(
        `/professionals/clients/${input.clientId}/meal-plan/draft/days/${input.weekday}`,
        { method: 'PUT', body: JSON.stringify({ meals: input.meals }) }
      );
    } catch (error) {
      throw toSafeActionError('saveDay', error, [
        ...MEAL_PLAN_ERRORS,
        TOO_MANY_REQUESTS,
      ]);
    }
  });
