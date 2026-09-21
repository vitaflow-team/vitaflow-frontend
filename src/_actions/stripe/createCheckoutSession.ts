'use server';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import { stripe } from '@/_lib/stripe';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

const ACTIVE_STATUSES = ['active', 'trialing', 'past_due'];

const inputSchema = z.object({
  productId: z.string(),
});

interface Product {
  id: string;
  name: string;
  stripeId: string | null;
}

interface SubscriptionState {
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionStatus: string | null;
}

export const actionCreateCheckoutSession = createServerAction()
  .input(inputSchema)
  .handler(async ({ input: { productId } }) => {
    const session = await auth();
    if (!session?.user?.email || !session.user.id) {
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

      if (
        subscription.stripeSubscriptionId &&
        ACTIVE_STATUSES.includes(subscription.subscriptionStatus ?? '')
      ) {
        throw new ZSAError(
          'ERROR',
          'Você já tem uma assinatura ativa — use "Trocar para este plano" em vez de assinar novamente.'
        );
      }

      const origin = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: product.stripeId, quantity: 1 }],
        customer: subscription.stripeCustomerId ?? undefined,
        customer_email: subscription.stripeCustomerId
          ? undefined
          : session.user.email,
        // Literal, não montado com URLSearchParams: o Stripe só troca o
        // marcador se as chaves chegarem sem escape. A volta cai na aba Plano
        // e a página continua sincronizando pelo `checkout_session_id`.
        success_url: `${origin}/restrict/settings?tab=plano&checkout_session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/restrict/settings?tab=plano`,
        metadata: {
          userId: session.user.id,
          productId: product.id,
        },
        subscription_data: {
          metadata: {
            userId: session.user.id,
          },
        },
      });

      if (!checkoutSession.url) {
        throw new ZSAError(
          'ERROR',
          'Não foi possível gerar a URL de pagamento.'
        );
      }

      return { url: checkoutSession.url };
    } catch (error) {
      if (error instanceof ZSAError) {
        throw error;
      }
      const message =
        error instanceof AppError || error instanceof Error
          ? error.message
          : 'Erro ao iniciar o pagamento.';
      throw new ZSAError('ERROR', message);
    }
  });
