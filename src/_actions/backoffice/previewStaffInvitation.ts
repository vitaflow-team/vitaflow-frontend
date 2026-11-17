'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError, TOO_MANY_REQUESTS } from '@/_lib/safeActionError';
import { staffInvitationTokenSchema } from '@/_schema/backoffice';
import type { ErrorMapping } from '@/_types/errorMapping';
import type { StaffInvitationPreview } from '@/_types/staffInvitationPreview';
import { createServerAction } from 'zsa';

const KNOWN_ERRORS: ErrorMapping[] = [
  {
    status: 400,
    code: 'invalid_token',
    message: 'Link de convite inválido ou expirado. Peça um novo convite.',
  },
  TOO_MANY_REQUESTS,
];

/**
 * What a staff invitation offers to an existing account (US-008). The token
 * travels in the request body, never in a URL.
 */
export const previewStaffInvitation = createServerAction()
  .input(staffInvitationTokenSchema)
  .handler(async ({ input: { token } }) => {
    try {
      return await apiClient<StaffInvitationPreview>(
        '/backoffice/staff/invitation/preview',
        { method: 'POST', body: JSON.stringify({ token }) }
      );
    } catch (error) {
      throw toSafeActionError('previewStaffInvitation', error, KNOWN_ERRORS);
    }
  });
