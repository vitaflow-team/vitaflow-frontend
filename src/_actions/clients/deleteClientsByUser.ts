'use server';

import { apiClient } from '@/_lib/apiClient';
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

export const actionDeleteClientsByUser = createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const session = await auth();

    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }

    try {
      const { id } = input;
      const clients = await apiClient(`/clients/${id}`, {
        method: 'DELETE',
      });
      return clients;
    } catch (error) {
      if (error instanceof Error) {
        throw new ZSAError('ERROR', error.message);
      }
      throw new ZSAError('ERROR', 'Erro ao excluir cliente.');
    }
  });
