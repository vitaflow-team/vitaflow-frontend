'use server';

import { INVITATION_NOT_FOUND } from '@/_constants/academiaErrors';
import { apiClient } from '@/_lib/apiClient';
import { parseAcademiaId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { assertEducator } from '@/_lib/studentsAuthorization';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

export const acceptEmploymentInvitation = createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertEducator();
    const id = parseAcademiaId(input.id);

    try {
      await apiClient(`/educators/me/academia-invitations/${id}/accept`, {
        method: 'POST',
      });
    } catch (error) {
      throw toSafeActionError('acceptEmploymentInvitation', error, [
        INVITATION_NOT_FOUND,
      ]);
    }
  });
