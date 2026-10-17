'use server';

import { MEAL_PLAN_ERRORS } from '@/_constants/mealPlanErrors';
import { apiClient } from '@/_lib/apiClient';
import { assertNutritionist } from '@/_lib/patientsAuthorization';
import { TOO_MANY_REQUESTS, toSafeActionError } from '@/_lib/safeActionError';
import type { MealPlanDraft } from '@/_types/mealPlan';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { z } from 'zod';

const inputSchema = z.object({
  clientId: z.uuid(),
  version: z.number().int().min(1),
});

/** A chosen past version's full content, fetched on demand for the clone picker. */
export const getVersionContent = createServerAction()
  .input(inputSchema)
  .handler(async ({ input }): Promise<MealPlanDraft> => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    await assertNutritionist();

    try {
      return await apiClient<MealPlanDraft>(
        `/professionals/clients/${input.clientId}/meal-plan/versions/${input.version}`,
        { method: 'GET' }
      );
    } catch (error) {
      throw toSafeActionError('getVersionContent', error, [
        ...MEAL_PLAN_ERRORS,
        TOO_MANY_REQUESTS,
      ]);
    }
  });
