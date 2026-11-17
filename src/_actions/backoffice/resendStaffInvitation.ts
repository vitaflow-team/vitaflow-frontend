'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { resendStaffInvitationSchema } from '@/_schema/backoffice';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

/**
 * Sends a pending staff invitation again (US-007.EC-2). The previous link
 * stops working as soon as the new one is issued.
 */
export const resendStaffInvitation = createServerAction()
  .input(resendStaffInvitationSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const staffId = parseBackendId(input.staffId);

    try {
      await apiClient(
        `/backoffice/staff/${staffId}/resend`,
        { method: 'POST' },
        { ownToken: true }
      );
    } catch (error) {
      throw toSafeActionError('resendStaffInvitation', error, [
        { status: 403, message: 'Ação restrita a administradores internos.' },
        { status: 404, message: 'Membro da equipe não encontrado.' },
        {
          status: 409,
          code: 'not_pending',
          message: 'Este convite já foi aceito ou cancelado.',
        },
      ]);
    }
  });
