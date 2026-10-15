'use server';

import { TURMA_REMOVE_ERRORS } from '@/_constants/academiaErrors';
import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { parseAcademiaId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { z } from 'zod';
import { ZSAError, createServerAction } from 'zsa';

export const removeTurma = createServerAction()
  .input(z.object({ turmaId: z.string() }))
  .handler(async ({ input: { turmaId } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();
    const id = parseAcademiaId(turmaId);

    try {
      await apiClient(`/academia/turmas/${id}`, { method: 'DELETE' });
    } catch (error) {
      throw toSafeActionError('removeTurma', error, TURMA_REMOVE_ERRORS);
    }
  });
