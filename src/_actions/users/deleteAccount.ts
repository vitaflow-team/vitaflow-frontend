'use server';

import { clearAccessTokenCookie } from '@/_lib/accessTokenCookie';
import { apiClient } from '@/_lib/apiClient';
import { stripe } from '@/_lib/stripe';
import { auth, signOut } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

interface SubscriptionState {
  productId: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

const GENERIC_FAILURE = 'Não foi possível excluir a conta. Tente novamente.';

/**
 * Cobrança cancelada já não existe mais para o Stripe, e uma que nunca
 * existiu também não: os dois casos deixam o usuário exatamente onde ele quer
 * ficar, então seguir em frente é a resposta certa (ADR-005, US-010.EC-4).
 */
function isAlreadyGone(error: unknown): boolean {
  const candidate = error as
    | { code?: unknown; statusCode?: unknown; message?: unknown }
    | null
    | undefined;

  if (candidate?.code === 'resource_missing' || candidate?.statusCode === 404) {
    return true;
  }

  // Só as duas frases que o Stripe usa para "isso já não está ativo". Um
  // `/cancelad[oa]/` solto aqui transformaria "não foi possível cancelar" em
  // sucesso e a conta seria apagada com a cobrança viva.
  return (
    typeof candidate?.message === 'string' &&
    /no such subscription|status ['"]?cancel+ed['"]? may not be updated/i.test(
      candidate.message
    )
  );
}

async function cancelNow(subscriptionId: string): Promise<void> {
  try {
    await stripe.subscriptions.cancel(subscriptionId);
  } catch (error) {
    if (isAlreadyGone(error)) {
      return;
    }
    throw error;
  }
}

/**
 * O Customer guarda dado pessoal, mas as faturas já emitidas continuam no
 * Stripe por retenção fiscal. Falhar aqui não desfaz nada: a conta já foi
 * apagada e a cobrança já parou, então o erro vira log sem dado pessoal
 * (ADR-005, US-010.EC-3).
 */
async function deleteCustomerQuietly(customerId: string): Promise<void> {
  try {
    await stripe.customers.del(customerId);
  } catch {
    console.error('Falha ao remover o Customer do Stripe após a exclusão.');
  }
}

/**
 * Exclusão definitiva da conta do próprio usuário autenticado — nenhum
 * identificador vem do cliente. A ordem importa (ADR-005): cancelar a
 * assinatura antes de apagar os dados, porque depois da exclusão ninguém mais
 * sabe qual assinatura pertencia a quem e a cobrança seguiria sozinha.
 *
 * Qualquer falha nas etapas cobertas pelo `try` devolve a mesma frase genérica:
 * mensagens do Stripe e do backend podem carregar identificadores internos.
 */
export const deleteAccount = createServerAction().handler(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
  }

  try {
    const subscription = await apiClient<SubscriptionState>(
      '/users/subscription',
      { method: 'GET' }
    );

    if (subscription.stripeSubscriptionId) {
      await cancelNow(subscription.stripeSubscriptionId);
    }

    await apiClient('/profile', { method: 'DELETE' });

    if (subscription.stripeCustomerId) {
      await deleteCustomerQuietly(subscription.stripeCustomerId);
    }
  } catch {
    throw new ZSAError('ERROR', GENERIC_FAILURE);
  }

  // Fora do `try` de propósito: o `signOut` do servidor encerra a sessão
  // lançando `NEXT_REDIRECT`, e o `catch` acima o transformaria em erro
  // genérico — o usuário ficaria com a conta apagada e a sessão de pé
  // (ADR-010). A limpeza do cookie é a mesma que o `events.signOut` faz, e
  // repeti-la aqui é inofensivo.
  await clearAccessTokenCookie();
  await signOut({ redirectTo: '/?aviso=conta-excluida' });
});
