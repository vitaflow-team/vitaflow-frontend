'use server';

import { MEAL_PLAN_ERRORS } from '@/_constants/mealPlanErrors';
import { apiClient } from '@/_lib/apiClient';
import { TOO_MANY_REQUESTS, toSafeActionError } from '@/_lib/safeActionError';
import type { MirrorMealPlanVersionContent } from '@/_types/professionalMirror';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { z } from 'zod';

const inputSchema = z.object({
  version: z.number().int().min(1),
});

/** A chosen past version's full content, fetched on demand from the patient's own mirror (ADR-008). */
export const getMealPlanVersionContent = createServerAction()
  .input(inputSchema)
  .handler(async ({ input }): Promise<MirrorMealPlanVersionContent> => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      return await apiClient<MirrorMealPlanVersionContent>(
        `/me/nutritionist/meal-plan/versions/${input.version}`,
        { method: 'GET' }
      );
    } catch (error) {
      throw toSafeActionError('getMealPlanVersionContent', error, [
        ...MEAL_PLAN_ERRORS,
        TOO_MANY_REQUESTS,
      ]);
    }
  });
