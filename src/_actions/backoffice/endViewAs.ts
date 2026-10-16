'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { clearViewAsCookie } from '@/_lib/viewAsCookie';
import { endViewAsSchema } from '@/_schema/backoffice';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

/**
 * Ends a "ver como" session (US-006). Always acts with the staff member's
 * own token, never the view-as token itself — the backend's own exemption
 * for this exact endpoint (ADR-004) exists for when there is no other
 * choice, but this action never needs to rely on it.
 */
export const endViewAs = createServerAction()
  .input(endViewAsSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const sessionId = parseBackendId(input.sessionId);

    try {
      await apiClient(
        `/backoffice/view-as-sessions/${sessionId}/end`,
        { method: 'POST' },
        { ownToken: true }
      );
    } catch (error) {
      throw toSafeActionError('endViewAs', error, [
        { status: 403, message: 'Ação restrita à equipe Vita Flow.' },
      ]);
    } finally {
      // Idempotent even if the backend call failed: a stale/unreadable
      // session should never trap the operator in "ver como" mode.
      await clearViewAsCookie();
    }
  });
