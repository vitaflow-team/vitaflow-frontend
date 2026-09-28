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
    message: 'Link de redefinição inválido ou expirado. Solicite um novo.',
  },
  { status: 401, message: 'A confirmação da senha não corresponde à senha.' },
  TOO_MANY_REQUESTS,
];

export const actionNewPassword = createServerAction()
  .input(newPasswordSchema.and(z.object({ token: z.string() })))
  .handler(async ({ input: { password, checkPassword, token } }) => {
    try {
      await apiClient('/users/newpassword', {
        method: 'POST',
        body: JSON.stringify({ password, checkPassword, token }),
      });
    } catch (error) {
      throw toSafeActionError('postNewPassword', error, KNOWN_ERRORS);
    }
  });
