'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { requestConnectionSchema } from '@/_schema/professionalDiscovery';
import type { ConnectionRequest } from '@/_types/professionalDiscovery';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import {
  DUPLICATE_PENDING_REQUEST,
  PROFESSIONAL_DISCOVERY_ERRORS,
} from './professionalDiscoveryErrors';

/** US-004: request to connect with a professional found through search. */
export const requestConnection = createServerAction()
  .input(requestConnectionSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const professionalId = parseBackendId(input.professionalId);

    try {
      return await apiClient<ConnectionRequest>(
        `/professionals/${professionalId}/connection-requests`,
        { method: 'POST' }
      );
    } catch (error) {
      throw toSafeActionError('requestConnection', error, [
        DUPLICATE_PENDING_REQUEST,
        ...PROFESSIONAL_DISCOVERY_ERRORS,
      ]);
    }
  });
