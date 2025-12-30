'use server';

import { AppError } from '@/_lib/AppError';
import { apiClient } from '@/_lib/apiClient';
import { clientSchema } from '@/_schema/client';
import { ZSAError, createServerAction } from 'zsa';

export const actionPostClientByUser = createServerAction()
  .input(clientSchema)
  .handler(async ({ input: { id, name, birthDate, email, phone } }) => {
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
