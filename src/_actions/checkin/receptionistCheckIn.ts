'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseAcademiaId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { z } from 'zod';
import { ZSAError, createServerAction } from 'zsa';

export const receptionistCheckIn = createServerAction()
  .input(z.object({ clientId: z.string() }))
  .handler(async ({ input: { clientId } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    const id = parseAcademiaId(clientId);

    try {
      return await apiClient<{ createdAt: string }>(
        `/academia/staff/students/${id}/checkin`,
        { method: 'POST' }
      );
    } catch (error) {
      throw toSafeActionError('receptionistCheckIn', error);
    }
  });
