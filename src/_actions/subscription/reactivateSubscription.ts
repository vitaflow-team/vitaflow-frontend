'use server';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

// Undoes a cancel-at-period-end scheduled by actionCancelSubscription, as
// long as the period hasn't actually ended yet (ADR-010: the backend sets
// the gateway subscription ACTIVE again).
export const actionReactivateSubscription = createServerAction().handler(
  async () => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      await apiClient('/users/subscription/reactivate', { method: 'PATCH' });

      return { success: true };
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 400) {
        console.error('Server Action "reactivateSubscription" failed.', {
          status: error.statusCode,
        });
        throw new ZSAError('ERROR', error.message);
      }
      throw toSafeActionError('reactivateSubscription', error);
    }
  }
);
