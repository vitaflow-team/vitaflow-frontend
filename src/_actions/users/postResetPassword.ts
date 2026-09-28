'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError, TOO_MANY_REQUESTS } from '@/_lib/safeActionError';
import { resetPasswordSchema } from '@/_schema/resetPassword';
import type { ErrorMapping } from '@/_types/errorMapping';
import { createServerAction } from 'zsa';

const KNOWN_ERRORS: ErrorMapping[] = [TOO_MANY_REQUESTS];

export const actionResetPassword = createServerAction()
  .input(resetPasswordSchema)
  .handler(async ({ input: { email } }) => {
    try {
      await apiClient('/users/recoverpass', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      throw toSafeActionError('postResetPassword', error, KNOWN_ERRORS);
    }
  });
