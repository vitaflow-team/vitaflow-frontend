'use server';

import { apiClient } from '@/_lib/apiClient';
import { auth } from '@/auth';
import Stripe from 'stripe';
import z from 'zod';
import { createServerAction, ZSAError } from 'zsa';

const checkoutInputSchema = z.object({
  productId: z.string(),
});

interface Product {
  id: string;
  name: string;
  price: number;
  stripeId: string | null;
}

export const actionCreateCheckoutSession = createServerAction()
  .input(checkoutInputSchema)
  .handler(async ({ input }) => {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const { productId } = input;

    let product: Product;
    try {
      product = await apiClient<Product>(`/products/${productId}`, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new ZSAError(
        'ERROR',
        'Produto não encontrado ou erro ao buscar detalhes.'
      );
    }

    if (!product.stripeId) {
      throw new ZSAError(
        'ERROR',
        'Este produto não possui configuração de pagamento (Stripe ID ausente).'
      );
    }

    if (!process.env.STRIPE_API_KEY) {
      throw new ZSAError(
        'ERROR',
        'Serviço de pagamento não configurado (Chave Stripe ausente).'
      );
    }

    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
      typescript: true,
    });

    let priceId = product.stripeId;

    if (product.stripeId.startsWith('prod_')) {
      try {
        const prices = await stripe.prices.list({
          product: product.stripeId,
          active: true,
          limit: 1,
        });

        if (prices.data.length === 0) {
          throw new ZSAError(
            'ERROR',
            'Nenhum preço encontrado para este produto no Stripe.'
          );
        }

        priceId = prices.data[0].id;
      } catch (error) {
        console.error('Error fetching prices:', error);
        throw new ZSAError('ERROR', 'Erro ao buscar preço do produto.');
      }
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    try {
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        customer_email: session.user.email,
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout/cancel`,
        metadata: {
          userId: session.user.id || '',
          productId: productId,
        },
      });

      if (!checkoutSession.url) {
        throw new ZSAError(
          'ERROR',
          'Não foi possível gerar a URL de pagamento.'
        );
      }

      return { url: checkoutSession.url };
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      const errorMessage =
        stripeError instanceof Error ? stripeError.message : 'Unknown error';
      throw new ZSAError(
        'ERROR',
        `Erro ao criar sessão de pagamento: ${errorMessage}`
      );
    }
  });
