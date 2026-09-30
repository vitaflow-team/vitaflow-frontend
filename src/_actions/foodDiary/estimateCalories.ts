'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { estimateCaloriesSchema } from '@/_schema/foodDiary';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { ESTIMATE_UNAVAILABLE } from './foodDiaryErrors';

/** Ephemeral — nothing is persisted by this call (US-001). */
export const actionEstimateCalories = createServerAction()
  .input(estimateCaloriesSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      return await apiClient<{ calories: number }>(
        '/food-diary/estimate-calories',
        { method: 'POST', body: JSON.stringify(input) }
      );
    } catch (error) {
      throw toSafeActionError('estimateCalories', error, [
        ESTIMATE_UNAVAILABLE,
      ]);
    }
  });
