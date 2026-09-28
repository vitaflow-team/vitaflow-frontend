'use server';

import { apiClient } from '@/_lib/apiClient';
import { assertProfessional } from '@/_lib/clientsAuthorization';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import type { ErrorMapping } from '@/_types/errorMapping';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

const KNOWN_ERRORS: ErrorMapping[] = [
  { status: 401, message: 'Você não tem acesso a este cliente.' },
  { status: 404, message: 'Cliente não encontrado.' },
];

export const actionGetClientById = createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const session = await auth();

    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }

    await assertProfessional();

    if (input.id === '0') return;
    const id = parseBackendId(input.id);

    try {
      const clients = await apiClient(`/clients/${id}`, {
        method: 'GET',
      });
      return clients;
    } catch (error) {
      throw toSafeActionError('getClientById', error, KNOWN_ERRORS);
    }
  });
