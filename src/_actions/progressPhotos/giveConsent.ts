'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { PREMIUM_REQUIRED } from './progressPhotosErrors';

export const actionGiveConsent = createServerAction().handler(async () => {
  const session = await auth();
  if (!session?.user) {
    throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
  }

  try {
    await apiClient('/progress-photos/consent', { method: 'POST' });
  } catch (error) {
    throw toSafeActionError('giveConsent', error, [PREMIUM_REQUIRED]);
  }
});
