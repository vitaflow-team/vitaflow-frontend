'use server';

import { apiClient } from '@/_lib/apiClient';
import { stripe } from '@/_lib/stripe';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

const inputSchema = z.object({
  productId: z.string(),
});

interface Product {
  id: string;
  stripeId: string | null;
}

interface SubscriptionState {
  stripeSubscriptionId: string | null;
  subscriptionStatus: string | null;
}

// Changes the price on an ALREADY active subscription (upgrade/downgrade
// between paid plans). Never creates a second Checkout Session — that would
// leave the customer with two parallel subscriptions in Stripe.
export const actionChangeSubscriptionPlan = createServerAction()
  .input(inputSchema)
  .handler(async ({ input: { productId } }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      const [product, subscription] = await Promise.all([
        apiClient<Product>(`/products/${productId}`, { method: 'GET' }),
        apiClient<SubscriptionState>('/users/subscription', {
          method: 'GET',
        }),
      ]);

      if (!product.stripeId) {
        throw new ZSAError(
          'ERROR',
          'Este plano não está disponível para assinatura online.'
        );
      }

      if (!subscription.stripeSubscriptionId) {
        throw new ZSAError(
          'ERROR',
          'Você ainda não tem uma assinatura ativa — escolha um plano para assinar.'
        );
      }

      const currentSubscription = await stripe.subscriptions.retrieve(
        subscription.stripeSubscriptionId
      );
      const currentItem = currentSubscription.items.data[0];
      if (!currentItem) {
        throw new ZSAError(
          'ERROR',
          'Não foi possível localizar o item da assinatura atual.'
        );
      }

      const updated = await stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        {
          items: [{ id: currentItem.id, price: product.stripeId }],
          proration_behavior: 'create_prorations',
        }
      );

      await apiClient('/users/subscription', {
        method: 'PATCH',
        body: JSON.stringify({
          productId: product.id,
          stripeCustomerId:
            typeof updated.customer === 'string'
              ? updated.customer
              : updated.customer.id,
          stripeSubscriptionId: updated.id,
          subscriptionStatus: updated.status,
        }),
      });

      return { success: true };
    } catch (error) {
      if (error instanceof ZSAError) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erro ao trocar de plano.';
      throw new ZSAError('ERROR', message);
    }
  });
