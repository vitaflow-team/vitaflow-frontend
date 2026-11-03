'use server';

import { clearAccessTokenCookie } from '@/_lib/accessTokenCookie';
import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import { auth, signOut } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

interface SubscriptionState {
  asaasSubscriptionId: string | null;
}

const GENERIC_FAILURE = 'Não foi possível excluir a conta. Tente novamente.';

/**
 * Cancelling a subscription that is already canceled, or that never
 * existed, leaves the user exactly where they want to be — continuing is
 * the right answer (ADR-005, US-010.EC-4). The backend's own cancel
 * endpoint answers this with a 400, the only status it ever uses for "no
 * active subscription" (ADR-010 — unlike the Stripe-era flow, there is no
 * gateway error to pattern-match against here, since the gateway call now
 * happens server-side).
 */
function isAlreadyGone(error: unknown): boolean {
  return error instanceof AppError && error.statusCode === 400;
}

async function cancelSubscriptionIfAny(): Promise<void> {
  const subscription = await apiClient<SubscriptionState>(
    '/users/subscription',
    { method: 'GET' }
  );
  if (!subscription.asaasSubscriptionId) {
    return;
  }

  try {
    await apiClient('/users/subscription/cancel', { method: 'PATCH' });
  } catch (error) {
    if (isAlreadyGone(error)) {
      return;
    }
    throw error;
  }
}

/**
 * Exclusão definitiva da conta do próprio usuário autenticado — nenhum
 * identificador vem do cliente. A ordem importa (ADR-005): cancelar a
 * assinatura antes de apagar os dados, porque depois da exclusão ninguém mais
 * sabe qual assinatura pertencia a quem e a cobrança seguiria sozinha. O
 * cancelamento em si é feito pelo backend — esta ação nunca fala com o
 * gateway diretamente (ADR-010).
 *
 * Qualquer falha nas etapas cobertas pelo `try` devolve a mesma frase
 * genérica: mensagens do backend podem carregar identificadores internos.
 */
export const deleteAccount = createServerAction().handler(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
  }

  try {
    await cancelSubscriptionIfAny();
    await apiClient('/profile', { method: 'DELETE' });
  } catch {
    throw new ZSAError('ERROR', GENERIC_FAILURE);
  }

  // Fora do `try` de propósito: o `signOut` do servidor encerra a sessão
  // lançando `NEXT_REDIRECT`, e o `catch` acima o transformaria em erro
  // genérico — o usuário ficaria com a conta apagada e a sessão de pé
  // (ADR-010). A limpeza do cookie é a mesma que o `events.signOut` faz, e
  // repeti-la aqui é inofensiva.
  await clearAccessTokenCookie();
  await signOut({ redirectTo: '/?aviso=conta-excluida' });
});
