'use server';

import { MEAL_PLAN_ERRORS } from '@/_constants/mealPlanErrors';
import { apiClient } from '@/_lib/apiClient';
import { assertNutritionist } from '@/_lib/patientsAuthorization';
import { TOO_MANY_REQUESTS, toSafeActionError } from '@/_lib/safeActionError';
import { publishMealPlanSchema } from '@/_schema/mealPlan';
import type { MealPlanVersion } from '@/_types/mealPlan';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const publishMealPlan = createServerAction()
  .input(publishMealPlanSchema)
  .handler(async ({ input }): Promise<MealPlanVersion> => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    await assertNutritionist();

    try {
      return await apiClient<MealPlanVersion>(
        `/professionals/clients/${input.clientId}/meal-plan/draft/publish`,
        { method: 'POST' }
      );
    } catch (error) {
      throw toSafeActionError('publishMealPlan', error, [
        ...MEAL_PLAN_ERRORS,
        TOO_MANY_REQUESTS,
      ]);
    }
  });
