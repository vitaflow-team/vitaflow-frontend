'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { setPreferenceSchema } from '@/_schema/notifications';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const actionSetPreference = createServerAction()
  .input(setPreferenceSchema)
  .handler(async ({ input: { category, enabled } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      await apiClient(`/notifications/preferences/${category}`, {
        method: 'PATCH',
        body: JSON.stringify({ enabled }),
      });
    } catch (error) {
      throw toSafeActionError('setPreference', error);
    }
  });
