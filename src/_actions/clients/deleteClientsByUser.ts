'use server';

import { apiClient } from '@/_lib/apiClient';
import { assertProfessional } from '@/_lib/clientsAuthorization';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import type { ErrorMapping } from '@/_types/errorMapping';
import { createServerAction, ZSAError } from 'zsa';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  professionalId: string;
  createdAt: string;
  updatedAt: string;
}

import { auth } from '@/auth';
import { z } from 'zod';

const KNOWN_ERRORS: ErrorMapping[] = [
  { status: 401, message: 'Exclusão não permitida.' },
];

export const actionDeleteClientsByUser = createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const session = await auth();

    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }

    await assertProfessional();

    const id = parseBackendId(input.id);

    try {
      const clients = await apiClient(`/clients/${id}`, {
        method: 'DELETE',
      });
      return clients;
    } catch (error) {
      throw toSafeActionError('deleteClientsByUser', error, KNOWN_ERRORS);
    }
  });
