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

// Undoes a cancel-at-period-end scheduled by actionCancelSubscription,
// as long as the period hasn't actually ended yet.
export const actionReactivateSubscription = createServerAction().handler(
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
        throw new ZSAError('ERROR', 'Nenhuma assinatura encontrada.');
      }

      const updated = await stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        { cancel_at_period_end: false }
      );

      await apiClient('/users/subscription', {
        method: 'PATCH',
        body: JSON.stringify({
          productId: subscription.productId,
          stripeCustomerId: subscription.stripeCustomerId,
          stripeSubscriptionId: updated.id,
          subscriptionStatus: updated.status,
          subscriptionCancelAt: null,
        }),
      });

      return { success: true };
    } catch (error) {
      if (error instanceof ZSAError) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erro ao reativar assinatura.';
      throw new ZSAError('ERROR', message);
    }
  }
);
