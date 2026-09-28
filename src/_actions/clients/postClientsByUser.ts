'use server';

import { apiClient } from '@/_lib/apiClient';
import { assertProfessional } from '@/_lib/clientsAuthorization';
import { toSafeActionError } from '@/_lib/safeActionError';
import { clientSchema } from '@/_schema/client';
import type { ErrorMapping } from '@/_types/errorMapping';
import { auth } from '@/auth';
import { revalidateTag } from 'next/cache';
import { createServerAction, ZSAError } from 'zsa';

// The backend answers 402 both for "already registered for this
// professional" and "registered under another id": either way the e-mail is
// taken.
const KNOWN_ERRORS: ErrorMapping[] = [
  { status: 400, message: 'Verifique os dados do cliente e tente novamente.' },
  { status: 402, message: 'Já existe um cliente cadastrado com este e-mail.' },
  { status: 404, message: 'Cliente não encontrado.' },
];

export const actionPostClientByUser = createServerAction()
  .input(clientSchema)
  .handler(async ({ input: { id, name, birthDate, email, phone } }) => {
    const session = await auth();

    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }

    await assertProfessional();

    try {
      const clients = await apiClient('/clients', {
        method: 'POST',
        body: JSON.stringify({ id, name, birthDate, email, phone }),
      });

      // The client list itself is never cached; revalidating from this action
      // still makes Next refresh the router cache for the pages showing it.
      revalidateTag('list-clientsByUser', { expire: 0 });

      return clients;
    } catch (error) {
      throw toSafeActionError('postClientsByUser', error, KNOWN_ERRORS);
    }
  });
