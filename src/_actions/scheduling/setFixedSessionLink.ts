'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { setOnlineLinkSchema } from '@/_schema/scheduling';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { SCHEDULING_ERRORS, SLOT_NOT_FOUND } from './schedulingErrors';

/** The educator's link for one fixed session; stored as given, like a booking's link. */
export const actionSetFixedSessionLink = createServerAction()
  .input(setOnlineLinkSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const fixedSessionId = parseBackendId(input.slotId);

    try {
      await apiClient(`/scheduling/fixed-sessions/${fixedSessionId}/link`, {
        method: 'PATCH',
        body: JSON.stringify({ link: input.link }),
      });
    } catch (error) {
      throw toSafeActionError('setFixedSessionLink', error, [
        SLOT_NOT_FOUND,
        ...SCHEDULING_ERRORS,
      ]);
    }
  });
