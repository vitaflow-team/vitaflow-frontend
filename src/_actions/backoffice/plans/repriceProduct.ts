'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { repriceProductSchema } from '@/_schema/backoffice';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

/**
 * Reprices a product (PRD US-003). Never edits the row in place — the
 * backend versions it (new active row, old row deactivated, same
 * transaction, ADR-004); existing subscribers keep their original price.
 * ADMIN-tier only (ADR-005).
 */
export const repriceProduct = createServerAction()
  .input(repriceProductSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const productId = parseBackendId(input.productId);

    try {
      await apiClient(
        `/backoffice/plans/${productId}/reprice`,
        { method: 'POST', body: JSON.stringify({ price: input.price }) },
        { ownToken: true }
      );
    } catch (error) {
      throw toSafeActionError('repriceProduct', error, [
        { status: 403, message: 'Ação restrita a administradores internos.' },
        { status: 400, message: 'O preço deve ser maior que zero.' },
        { status: 404, message: 'Produto não encontrado.' },
      ]);
    }
  });
