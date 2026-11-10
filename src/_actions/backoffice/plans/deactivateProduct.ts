'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { deactivateProductSchema } from '@/_schema/backoffice';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

/**
 * Soft-retires a product (PRD US-004). The row is never deleted — it stops
 * being offered to new signups but existing subscribers are unaffected
 * (ADR-004/ADR-008). ADMIN-tier only (ADR-005).
 */
export const deactivateProduct = createServerAction()
  .input(deactivateProductSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const productId = parseBackendId(input.productId);

    try {
      await apiClient(
        `/backoffice/plans/${productId}/deactivate`,
        { method: 'POST' },
        { ownToken: true }
      );
    } catch (error) {
      throw toSafeActionError('deactivateProduct', error, [
        { status: 403, message: 'Ação restrita a administradores internos.' },
        { status: 404, message: 'Produto não encontrado.' },
      ]);
    }
  });
