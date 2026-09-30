'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { logMealSchema } from '@/_schema/foodDiary';
import type { Meal } from '@/_types/foodDiary';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { INVALID_MEAL } from './foodDiaryErrors';

export const actionLogMeal = createServerAction()
  .input(logMealSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      return await apiClient<Meal>('/food-diary/meals', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } catch (error) {
      throw toSafeActionError('logMeal', error, [INVALID_MEAL]);
    }
  });
