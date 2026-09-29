'use server';

import { apiClient } from '@/_lib/apiClient';
import { assertProfessional } from '@/_lib/clientsAuthorization';
import { toSafeActionError } from '@/_lib/safeActionError';
import { ClientFormData } from '@/_schema/client';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const actionGetClientsByUser = createServerAction().handler(async () => {
  const session = await auth();

  if (!session?.user) {
    throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
  }

  await assertProfessional();

  try {
    // Per-user data is never cached (frontend-next.md §5), so no cache tag.
    const clients = await apiClient<ClientFormData[]>('/clients', {
      method: 'GET',
      cache: 'no-store',
    });
    return clients;
  } catch (error) {
    throw toSafeActionError('getClientsByUser', error);
  }
});
