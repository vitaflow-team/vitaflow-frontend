'use server';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth, unstable_update } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

const inputSchema = z.object({
  productId: z.string(),
});

// Changes the price on an ALREADY active subscription (upgrade/downgrade
// between paid plans). The backend computes and issues the proration
// adjustment charge and updates the subscription's recurring value — this
// action never calls a gateway SDK (ADR-010).
export const actionChangeSubscriptionPlan = createServerAction()
  .input(inputSchema)
  .handler(async ({ input: { productId } }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const productPathId = parseBackendId(productId);

    try {
      await apiClient('/users/subscription/plan', {
        method: 'PATCH',
        body: JSON.stringify({ productId: productPathId }),
      });
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 400) {
        console.error('Server Action "changeSubscriptionPlan" failed.', {
          status: error.statusCode,
        });
        throw new ZSAError('ERROR', error.message);
      }
      throw toSafeActionError('changeSubscriptionPlan', error);
    }

    // A sessão congela o plano no login; sem isto o menu e o acesso só
    // mudariam no próximo login. O callback relê o perfil do servidor, então
    // não há dado do cliente aqui. Uma falha não desfaz a troca já feita:
    // a página de Configurações ainda sincroniza na próxima visita (ADR-008).
    await unstable_update({}).catch(() => undefined);

    return { success: true };
  });
