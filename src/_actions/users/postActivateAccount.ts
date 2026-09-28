'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { z } from 'zod';
import { createServerAction } from 'zsa';

/**
 * The only code path that activates an account. Opening the e-mail link just
 * renders a confirmation; a link scanner prefetching it activates nothing
 * (US-008).
 */
export const actionActivateAccount = createServerAction()
  .input(z.object({ token: z.string().min(1) }))
  .handler(async ({ input: { token } }) => {
    try {
      await apiClient('/users/activate', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    } catch (error) {
      throw toSafeActionError('postActivateAccount', error);
    }
  });
