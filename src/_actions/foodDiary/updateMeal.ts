'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { updateMealSchema } from '@/_schema/foodDiary';
import type { Meal } from '@/_types/foodDiary';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { INVALID_MEAL, MEAL_NOT_FOUND } from './foodDiaryErrors';

export const actionUpdateMeal = createServerAction()
  .input(updateMealSchema)
  .handler(async ({ input: { mealId, ...values } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const id = parseBackendId(mealId);

    try {
      return await apiClient<Meal>(`/food-diary/meals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(values),
      });
    } catch (error) {
      throw toSafeActionError('updateMeal', error, [
        INVALID_MEAL,
        MEAL_NOT_FOUND,
      ]);
    }
  });
