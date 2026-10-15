'use server';

import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { isBackendError } from '@/_lib/backendError';
import { parseAcademiaId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

export const removeStaff = createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();
    const id = parseAcademiaId(input.id);

    try {
      await apiClient(`/academia/staff/${id}`, { method: 'DELETE' });
    } catch (error) {
      if (!isBackendError(error, 404)) {
        throw toSafeActionError('removeStaff', error);
      }
    }
  });
