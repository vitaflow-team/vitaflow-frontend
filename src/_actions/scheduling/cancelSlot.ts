'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { cancelSlotSchema } from '@/_schema/scheduling';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { SCHEDULING_ERRORS, SLOT_NOT_FOUND } from './schedulingErrors';

/** US-004/US-008: either party cancels; a late cancellation still succeeds. */
export const actionCancelSlot = createServerAction()
  .input(cancelSlotSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const slotId = parseBackendId(input.slotId);

    try {
      await apiClient(`/scheduling/slots/${slotId}/cancel`, {
        method: 'POST',
      });
    } catch (error) {
      throw toSafeActionError('cancelSlot', error, [
        SLOT_NOT_FOUND,
        ...SCHEDULING_ERRORS,
      ]);
    }
  });
