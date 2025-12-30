'use server';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import { clientSchema } from '@/_schema/client';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const actionPostClientByUser = createServerAction()
  .input(clientSchema)
  .handler(async ({ input: { id, name, birthDate, email, phone } }) => {
    const session = await auth();

    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }

    console.log(id, name, birthDate, email, phone);
    try {
      const clients = await apiClient('/clients', {
        method: 'POST',
        body: JSON.stringify({ id, name, birthDate, email, phone }),
      });
      return clients;
    } catch (error) {
      if (error instanceof AppError) {
        throw new ZSAError('ERROR', error.message);
      }
      throw new ZSAError('ERROR', 'Erro ao criar ou alterar o cliente.');
    }
  });
