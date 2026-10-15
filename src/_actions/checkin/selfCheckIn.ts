'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const selfCheckIn = createServerAction().handler(async () => {
  const session = await auth();
  if (!session?.user) {
    throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
  }

  try {
    return await apiClient<{ createdAt: string }>('/checkins', {
      method: 'POST',
    });
  } catch (error) {
    throw toSafeActionError('selfCheckIn', error);
  }
});
