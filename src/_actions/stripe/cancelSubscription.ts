'use server';

import { apiClient } from '@/_lib/apiClient';
import { stripe } from '@/_lib/stripe';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

interface SubscriptionState {
  productId: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

// Cancels at the end of the current billing period rather than
// immediately — the user already paid for it, so access shouldn't be
// yanked away mid-period. Access reverts to the free plan only once
// Stripe's `customer.subscription.deleted` webhook confirms the period
// actually ended.
export const actionCancelSubscription = createServerAction().handler(
  async () => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      const subscription = await apiClient<SubscriptionState>(
        '/users/subscription',
        { method: 'GET' }
      );

      if (!subscription.stripeSubscriptionId || !subscription.productId) {
        throw new ZSAError(
          'ERROR',
          'Você não tem uma assinatura ativa para cancelar.'
        );
      }

      const updated = await stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        { cancel_at_period_end: true }
      );

      await apiClient('/users/subscription', {
        method: 'PATCH',
        body: JSON.stringify({
          productId: subscription.productId,
          stripeCustomerId: subscription.stripeCustomerId,
          stripeSubscriptionId: updated.id,
          subscriptionStatus: updated.status,
          subscriptionCancelAt: updated.cancel_at
            ? new Date(updated.cancel_at * 1000).toISOString()
            : null,
        }),
      });

      return {
        cancelAt: updated.cancel_at
          ? new Date(updated.cancel_at * 1000).toISOString()
          : null,
      };
    } catch (error) {
      if (error instanceof ZSAError) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erro ao cancelar assinatura.';
      throw new ZSAError('ERROR', message);
    }
  }
);
