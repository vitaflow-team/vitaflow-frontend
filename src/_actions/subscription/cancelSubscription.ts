'use server';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

interface SubscriptionResponse {
  subscriptionCancelAt: string | null;
}

// Cancels at the end of the current billing period rather than
// immediately — the user already paid for it, so access shouldn't be
// yanked away mid-period. The backend sets the gateway subscription
// INACTIVE (stopping further charges right away) while keeping local
// access alive until the period end (ADR-010 TechSpec addendum).
export const actionCancelSubscription = createServerAction().handler(
  async () => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      const result = await apiClient<SubscriptionResponse>(
        '/users/subscription/cancel',
        { method: 'PATCH' }
      );

      return { cancelAt: result.subscriptionCancelAt };
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 400) {
        console.error('Server Action "cancelSubscription" failed.', {
          status: error.statusCode,
        });
        throw new ZSAError('ERROR', error.message);
      }
      throw toSafeActionError('cancelSubscription', error);
    }
  }
);
