'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { inviteStaffSchema } from '@/_schema/backoffice';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

/** Invites a new internal staff member (US-007, US-007.EC-1, US-007.EC-2). */
export const inviteStaff = createServerAction()
  .input(inviteStaffSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      await apiClient(
        '/backoffice/staff',
        { method: 'POST', body: JSON.stringify(input) },
        { ownToken: true }
      );
    } catch (error) {
      throw toSafeActionError('inviteStaff', error, [
        { status: 403, message: 'Ação restrita a administradores internos.' },
        {
          status: 409,
          code: 'invitation_pending',
          message: 'Já existe um convite pendente para este e-mail.',
        },
        {
          status: 409,
          code: 'already_staff',
          message: 'Este e-mail já pertence a um membro da equipe ativo.',
        },
      ]);
    }
  });
