'use server';

import { apiClient } from '@/_lib/apiClient';
import { stripe } from '@/_lib/stripe';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

const updateSubscriptionSchema = z.object({
  sessionId: z.string(),
});

// Called right after Stripe redirects back to /restrict/settings with
// ?checkout_session_id=... — a fast-path optimistic sync so the UI reflects
// the new plan immediately instead of waiting for the webhook to arrive.
// The webhook (checkout.session.completed) still runs independently and is
// the authoritative sync — this is a UX nicety, not the only path.
export const actionUpdateSubscription = createServerAction()
  .input(updateSubscriptionSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      const checkoutSession = await stripe.checkout.sessions.retrieve(
        input.sessionId,
        { expand: ['subscription'] }
      );

      if (checkoutSession.metadata?.userId !== session.user.id) {
        throw new ZSAError(
          'FORBIDDEN',
          'Esta sessão de pagamento não pertence a este usuário.'
        );
      }

      const productId = checkoutSession.metadata?.productId;
      if (!productId) {
        throw new ZSAError('ERROR', 'Produto não encontrado na sessão.');
      }

      const subscription =
        typeof checkoutSession.subscription === 'string'
          ? await stripe.subscriptions.retrieve(checkoutSession.subscription)
          : checkoutSession.subscription;

      if (!subscription) {
        throw new ZSAError(
          'ERROR',
          'Assinatura ainda não confirmada pelo Stripe — tente novamente em instantes.'
        );
      }

      const customerId =
        typeof checkoutSession.customer === 'string'
          ? checkoutSession.customer
          : checkoutSession.customer?.id;

      if (!customerId) {
        throw new ZSAError('ERROR', 'Cliente Stripe não encontrado.');
      }

      await apiClient('/users/subscription', {
        method: 'PATCH',
        body: JSON.stringify({
          productId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
        }),
      });

      return { success: true };
    } catch (error) {
      if (error instanceof ZSAError) {
        throw error;
      }
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao atualizar assinatura.';
      throw new ZSAError('ERROR', message);
    }
  });
