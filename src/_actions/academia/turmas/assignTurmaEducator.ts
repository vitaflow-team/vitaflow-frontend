'use server';

import { TURMA_ASSIGN_EDUCATOR_ERRORS } from '@/_constants/academiaErrors';
import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { parseAcademiaId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { z } from 'zod';
import { ZSAError, createServerAction } from 'zsa';

export const assignTurmaEducator = createServerAction()
  .input(
    z.object({
      turmaId: z.string(),
      professionalId: z.string().nullable(),
    })
  )
  .handler(async ({ input: { turmaId, professionalId } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();
    const id = parseAcademiaId(turmaId);

    try {
      await apiClient(`/academia/turmas/${id}/assign-educator`, {
        method: 'POST',
        body: JSON.stringify({ professionalId }),
      });
    } catch (error) {
      throw toSafeActionError(
        'assignTurmaEducator',
        error,
        TURMA_ASSIGN_EDUCATOR_ERRORS
      );
    }
  });
