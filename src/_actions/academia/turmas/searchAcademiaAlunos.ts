'use server';

import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import type { AcademiaAlunosList } from '@/_types/academiaAlunos';
import { auth } from '@/auth';
import { z } from 'zod';
import { ZSAError, createServerAction } from 'zsa';

export const searchAcademiaAlunos = createServerAction()
  .input(z.object({ search: z.string().trim().min(1).max(100) }))
  .handler(async ({ input: { search } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();

    try {
      return await apiClient<AcademiaAlunosList>(
        `/academia/students?search=${encodeURIComponent(search)}`,
        { method: 'GET', cache: 'no-store' }
      );
    } catch (error) {
      throw toSafeActionError('searchAcademiaAlunos', error);
    }
  });
