'use server';

import { getEnv } from '@/_lib/getenv';
import { resetPasswordSchema } from '@/_schema/resetPassword';
import { createServerAction, ZSAError } from 'zsa';

export const actionResetPassword = createServerAction()
  .input(resetPasswordSchema)
  .handler(async ({ input: { email } }) => {
    await fetch(getEnv('BACKEND_URL') + '/users/recoverpass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      cache: 'no-store',
    }).catch(() => {
      throw new ZSAError(
        'ERROR',
        'Error accessing the new user registration service.'
      );
    });
  });
