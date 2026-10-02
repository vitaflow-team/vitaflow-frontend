'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { bookSlotSchema } from '@/_schema/scheduling';
import type { Slot } from '@/_types/scheduling';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import {
  NOT_ELIGIBLE,
  SCHEDULING_ERRORS,
  SLOT_JUST_TAKEN,
  SLOT_NOT_FOUND,
} from './schedulingErrors';

/** US-006: book an open slot instantly — no approval step (ADR-002). */
export const actionBookSlot = createServerAction()
  .input(bookSlotSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const slotId = parseBackendId(input.slotId);

    try {
      return await apiClient<Slot>(`/scheduling/slots/${slotId}/book`, {
        method: 'POST',
        body: JSON.stringify({ type: input.type }),
      });
    } catch (error) {
      throw toSafeActionError('bookSlot', error, [
        NOT_ELIGIBLE,
        SLOT_JUST_TAKEN,
        SLOT_NOT_FOUND,
        ...SCHEDULING_ERRORS,
      ]);
    }
  });
