'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { connectionRequestIdSchema } from '@/_schema/professionalDiscovery';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import {
  PROFESSIONAL_DISCOVERY_ERRORS,
  REQUEST_NOT_PENDING,
} from './professionalDiscoveryErrors';

/** US-008: accept a pending request, creating the Client relationship. */
export const acceptRequest = createServerAction()
  .input(connectionRequestIdSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const requestId = parseBackendId(input.id);

    try {
      await apiClient(`/connection-requests/${requestId}/accept`, {
        method: 'POST',
      });
    } catch (error) {
      throw toSafeActionError('acceptRequest', error, [
        REQUEST_NOT_PENDING,
        ...PROFESSIONAL_DISCOVERY_ERRORS,
      ]);
    }
  });
