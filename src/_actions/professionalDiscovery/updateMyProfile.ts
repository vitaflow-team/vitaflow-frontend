'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { updateProfileSchema } from '@/_schema/professionalDiscovery';
import type { ProfessionalProfile } from '@/_types/professionalDiscovery';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import {
  CONTENT_REJECTED,
  PROFESSIONAL_DISCOVERY_ERRORS,
} from './professionalDiscoveryErrors';

/** US-010: the professional edits their own public profile. */
export const updateMyProfile = createServerAction()
  .input(updateProfileSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      return await apiClient<ProfessionalProfile>('/professionals/me/profile', {
        method: 'PATCH',
        body: JSON.stringify(input),
      });
    } catch (error) {
      throw toSafeActionError('updateMyProfile', error, [
        CONTENT_REJECTED,
        ...PROFESSIONAL_DISCOVERY_ERRORS,
      ]);
    }
  });
