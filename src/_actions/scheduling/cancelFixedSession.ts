'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { cancelSlotSchema } from '@/_schema/scheduling';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { SCHEDULING_ERRORS, SLOT_NOT_FOUND } from './schedulingErrors';

const CANCEL_FIXED_ERRORS = [
  {
    status: 400,
    code: 'session_not_cancelable',
    message: 'Esta sessão já aconteceu ou está acontecendo.',
  },
  {
    status: 409,
    code: 'session_not_cancelable',
    message: 'Esta sessão já foi cancelada.',
  },
  SLOT_NOT_FOUND,
  ...SCHEDULING_ERRORS,
];

/** One date of a fixed time, by either side; the other side is told. */
export const actionCancelFixedSession = createServerAction()
  .input(cancelSlotSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const fixedSessionId = parseBackendId(input.slotId);

    try {
      await apiClient(`/scheduling/fixed-sessions/${fixedSessionId}/cancel`, {
        method: 'POST',
      });
    } catch (error) {
      throw toSafeActionError('cancelFixedSession', error, CANCEL_FIXED_ERRORS);
    }
  });
