'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { publishAvailabilitySchema } from '@/_schema/scheduling';
import type { AvailabilityWindow } from '@/_types/scheduling';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { END_BEFORE_START, SCHEDULING_ERRORS } from './schedulingErrors';

/** US-001: publish a recurring weekly availability window. */
export const actionPublishAvailability = createServerAction()
  .input(publishAvailabilitySchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      return await apiClient<AvailabilityWindow>('/scheduling/availability', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } catch (error) {
      throw toSafeActionError('publishAvailability', error, [
        END_BEFORE_START,
        ...SCHEDULING_ERRORS,
      ]);
    }
  });
