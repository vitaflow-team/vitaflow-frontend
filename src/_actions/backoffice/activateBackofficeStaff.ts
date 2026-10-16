'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError, TOO_MANY_REQUESTS } from '@/_lib/safeActionError';
import { newPasswordSchema } from '@/_schema/newPassword';
import type { ErrorMapping } from '@/_types/errorMapping';
import { z } from 'zod';
import { createServerAction } from 'zsa';

const KNOWN_ERRORS: ErrorMapping[] = [
  {
    status: 400,
    code: 'invalid_token',
    message: 'Link de ativação inválido ou expirado. Peça um novo convite.',
  },
  TOO_MANY_REQUESTS,
];

/** Activates a Vita Flow internal staff invitation (US-007). */
export const activateBackofficeStaff = createServerAction()
  .input(newPasswordSchema.and(z.object({ token: z.string().min(1) })))
  .handler(async ({ input: { password, token } }) => {
    try {
      await apiClient('/backoffice/staff/activate', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
    } catch (error) {
      throw toSafeActionError('activateBackofficeStaff', error, KNOWN_ERRORS);
    }
  });
