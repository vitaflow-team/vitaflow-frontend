'use server';

import { ASSIGN_EDUCATOR_ERRORS } from '@/_constants/academiaErrors';
import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { parseAcademiaId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { z } from 'zod';
import { ZSAError, createServerAction } from 'zsa';

export const assignEducator = createServerAction()
  .input(
    z.object({
      studentId: z.string(),
      professionalId: z.string().nullable(),
    })
  )
  .handler(async ({ input: { studentId, professionalId } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();
    const id = parseAcademiaId(studentId);

    try {
      await apiClient(`/academia/students/${id}/assign-educator`, {
        method: 'POST',
        body: JSON.stringify({ professionalId }),
      });
    } catch (error) {
      throw toSafeActionError('assignEducator', error, ASSIGN_EDUCATOR_ERRORS);
    }
  });
