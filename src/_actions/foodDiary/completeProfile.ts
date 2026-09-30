'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { completeProfileSchema } from '@/_schema/foodDiary';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const actionCompleteProfile = createServerAction()
  .input(completeProfileSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      await apiClient('/food-diary/profile', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } catch (error) {
      throw toSafeActionError('completeProfile', error);
    }
  });
