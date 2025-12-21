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

export const actionGetClientsByUser = createServerAction().handler(async () => {
  try {
    const clients = await apiClient<Client[]>('/clients/clients');
    return clients;
  } catch (error) {
    if (error instanceof Error) {
      throw new ZSAError('ERROR', error.message);
    }
    throw new ZSAError('ERROR', 'Erro ao buscar clientes.');
  }
});
