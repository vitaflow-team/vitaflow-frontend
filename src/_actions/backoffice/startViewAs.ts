'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { setViewAsCookie } from '@/_lib/viewAsCookie';
import { startViewAsSchema } from '@/_schema/backoffice';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

interface StartViewAsResponse {
  token: string;
  sessionId: string;
  expiresAt: string;
}

/** Starts a "ver como" session with a mandatory reason (US-003). */
export const startViewAs = createServerAction()
  .input(startViewAsSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    // Both a Users id and an AcademiaStaffMember id are uuid(7), so the same
    // validation applies regardless of targetKind.
    const targetId = parseBackendId(input.targetId);

    try {
      const result = await apiClient<StartViewAsResponse>(
        '/backoffice/view-as-sessions',
        {
          method: 'POST',
          body: JSON.stringify({
            targetKind: input.targetKind,
            targetId,
            reason: input.reason,
          }),
        },
        { ownToken: true }
      );

      await setViewAsCookie({
        token: result.token,
        sessionId: result.sessionId,
        targetLabel: input.targetLabel,
      });
    } catch (error) {
      throw toSafeActionError('startViewAs', error, [
        { status: 400, message: 'Informe o motivo do acesso.' },
        { status: 403, message: 'Ação restrita à equipe Vita Flow.' },
      ]);
    }
  });
