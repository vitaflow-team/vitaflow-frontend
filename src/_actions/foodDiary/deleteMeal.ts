'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { z } from 'zod';
import { MEAL_NOT_FOUND } from './foodDiaryErrors';

export const actionDeleteMeal = createServerAction()
  .input(z.object({ mealId: z.uuid() }))
  .handler(async ({ input: { mealId } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const id = parseBackendId(mealId);

    try {
      await apiClient(`/food-diary/meals/${id}`, { method: 'DELETE' });
    } catch (error) {
      throw toSafeActionError('deleteMeal', error, [MEAL_NOT_FOUND]);
    }
  });
