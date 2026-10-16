'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { removeStaffSchema } from '@/_schema/backoffice';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

const LAST_ADMIN_MESSAGE =
  'Pelo menos um administrador interno deve sempre permanecer.';

/** Removes a staff member's internal access (US-009, US-009.EC-1). */
export const removeStaff = createServerAction()
  .input(removeStaffSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const staffId = parseBackendId(input.staffId);

    try {
      await apiClient(
        `/backoffice/staff/${staffId}`,
        { method: 'DELETE' },
        { ownToken: true }
      );
    } catch (error) {
      throw toSafeActionError('removeStaff', error, [
        { status: 403, message: 'Ação restrita a administradores internos.' },
        {
          status: 409,
          code: 'last_admin_required',
          message: LAST_ADMIN_MESSAGE,
        },
        { status: 404, message: 'Membro da equipe não encontrado.' },
      ]);
    }
  });
