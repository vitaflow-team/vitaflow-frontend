'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { markReadSchema } from '@/_schema/notifications';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { NOTIFICATION_NOT_FOUND } from './notificationsErrors';

export const actionMarkRead = createServerAction()
  .input(markReadSchema)
  .handler(async ({ input: { notificationId } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const id = parseBackendId(notificationId);

    try {
      await apiClient(`/notifications/${id}/read`, { method: 'POST' });
    } catch (error) {
      throw toSafeActionError('markRead', error, [NOTIFICATION_NOT_FOUND]);
    }
  });
