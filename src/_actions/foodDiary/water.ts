'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { z } from 'zod';

const dateInput = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) });

async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
  }
}

export const actionIncrementWater = createServerAction()
  .input(dateInput)
  .handler(async ({ input: { date } }) => {
    await requireSession();
    try {
      return await apiClient<{ count: number }>(
        `/food-diary/water?date=${date}`,
        { method: 'POST' }
      );
    } catch (error) {
      throw toSafeActionError('incrementWater', error);
    }
  });

export const actionDecrementWater = createServerAction()
  .input(dateInput)
  .handler(async ({ input: { date } }) => {
    await requireSession();
    try {
      return await apiClient<{ count: number }>(
        `/food-diary/water?date=${date}`,
        { method: 'DELETE' }
      );
    } catch (error) {
      throw toSafeActionError('decrementWater', error);
    }
  });
