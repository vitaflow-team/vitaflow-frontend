'use server';

import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { TOO_MANY_REQUESTS, toSafeActionError } from '@/_lib/safeActionError';
import { INVITE_ERRORS } from '@/_constants/academiaErrors';
import { inviteAcademiaMemberSchema } from '@/_schema/academia';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const inviteAcademiaMember = createServerAction()
  .input(inviteAcademiaMemberSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();

    try {
      await apiClient('/academia/invitations', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } catch (error) {
      throw toSafeActionError('inviteAcademiaMember', error, [
        ...INVITE_ERRORS,
        TOO_MANY_REQUESTS,
      ]);
    }
  });
