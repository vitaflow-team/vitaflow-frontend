'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { listOpenSlotsSchema } from '@/_schema/scheduling';
import type { Slot } from '@/_types/scheduling';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { SCHEDULING_ERRORS } from './schedulingErrors';

// US-005: browsing open slots needs no relationship check — called from the
// client-side date picker whenever the selected day changes.
export const actionListOpenSlots = createServerAction()
  .input(listOpenSlotsSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const professionalId = parseBackendId(input.professionalId);
    const query = new URLSearchParams({
      professionalId,
      from: input.from,
      to: input.to,
    });

    try {
      return await apiClient<Slot[]>(`/scheduling/slots?${query.toString()}`, {
        method: 'GET',
        cache: 'no-store',
      });
    } catch (error) {
      throw toSafeActionError('listOpenSlots', error, SCHEDULING_ERRORS);
    }
  });
