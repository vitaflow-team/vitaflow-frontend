'use server';

import { apiClient } from '@/_lib/apiClient';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

export const actionGetClientById = createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const { id } = input;
    if (!id || id === '0') return;

    try {
      const clients = await apiClient(`/clients/${id}`, {
        method: 'GET',
      });
      return clients;
    } catch (error) {
      if (error instanceof Error) {
        throw new ZSAError('ERROR', error.message);
      }
      throw new ZSAError('ERROR', 'Erro ao buscar clientes.');
    }
  });
