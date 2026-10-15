'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { z } from 'zod';
import { ZSAError, createServerAction } from 'zsa';

export interface ReceptionistStudent {
  id: string;
  name: string;
}

export const searchStudents = createServerAction()
  .input(z.object({ search: z.string().trim() }))
  .handler(async ({ input: { search } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }

    try {
      return await apiClient<ReceptionistStudent[]>(
        `/academia/staff/students?search=${encodeURIComponent(search)}`,
        { method: 'GET', cache: 'no-store' }
      );
    } catch (error) {
      throw toSafeActionError('searchStudents', error);
    }
  });
