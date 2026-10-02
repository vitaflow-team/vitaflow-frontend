'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { setOnlineLinkSchema } from '@/_schema/scheduling';
import type { Slot } from '@/_types/scheduling';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { SCHEDULING_ERRORS, SLOT_NOT_FOUND } from './schedulingErrors';

// ADR-001: no validation of the link's contents — stored and returned
// exactly as the professional provides it.
export const actionSetOnlineLink = createServerAction()
  .input(setOnlineLinkSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const slotId = parseBackendId(input.slotId);

    try {
      return await apiClient<Slot>(`/scheduling/slots/${slotId}/link`, {
        method: 'PATCH',
        body: JSON.stringify({ link: input.link }),
      });
    } catch (error) {
      throw toSafeActionError('setOnlineLink', error, [
        SLOT_NOT_FOUND,
        ...SCHEDULING_ERRORS,
      ]);
    }
  });
