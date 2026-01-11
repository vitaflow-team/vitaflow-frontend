'use server';

import { apiClient } from '@/_lib/apiClient';
import { ClientFormData } from '@/_schema/client';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const actionGetClientsByUser = createServerAction().handler(async () => {
  const session = await auth();

  if (!session?.user) {
    throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
  }

  try {
    const clients = await apiClient<ClientFormData[]>('/clients', {
      method: 'GET',
      next: { tags: ['list-clientsByUser'] },
    });
    return clients;
  } catch (error) {
    if (error instanceof Error) {
      throw new ZSAError('ERROR', error.message);
    }
    throw new ZSAError('ERROR', 'Erro ao buscar clientes.');
  }
});
