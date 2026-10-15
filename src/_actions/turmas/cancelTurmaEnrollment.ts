'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseAcademiaId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { z } from 'zod';
import { ZSAError, createServerAction } from 'zsa';

export const cancelTurmaEnrollment = createServerAction()
  .input(z.object({ turmaId: z.string() }))
  .handler(async ({ input: { turmaId } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    const id = parseAcademiaId(turmaId);

    try {
      await apiClient(`/turmas/${id}/enroll`, { method: 'DELETE' });
    } catch (error) {
      throw toSafeActionError('cancelTurmaEnrollment', error);
    }
  });
