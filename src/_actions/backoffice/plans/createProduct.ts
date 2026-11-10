'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { createProductSchema } from '@/_schema/backoffice';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

/** Creates a new platform product (PRD US-002, ADR-005 — ADMIN-tier only). */
export const createProduct = createServerAction()
  .input(createProductSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      await apiClient(
        '/backoffice/plans',
        { method: 'POST', body: JSON.stringify(input) },
        { ownToken: true }
      );
    } catch (error) {
      throw toSafeActionError('createProduct', error, [
        { status: 403, message: 'Ação restrita a administradores internos.' },
        {
          status: 400,
          message: 'Verifique os dados do produto: nome, preço, tipo e tier.',
        },
      ]);
    }
  });
