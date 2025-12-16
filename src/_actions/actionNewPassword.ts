'use server';

import { getEnv } from '@/_lib/getenv';
import { newPasswordSchema } from '@/_schema/newPassword';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

export const actionNewPassword = createServerAction()
  .input(newPasswordSchema.and(z.object({ token: z.string() })))
  .handler(async ({ input: { password, checkPassword, token } }) => {
    await fetch(getEnv('BACKEND_URL') + '/users/newpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, checkPassword, token }),
      cache: 'no-store',
    }).catch(() => {
      throw new ZSAError('ERROR', 'Erro ao alterar a senha.');
    });
  });
