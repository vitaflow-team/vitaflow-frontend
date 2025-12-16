'use server';

import { apiClient } from '@/_lib/apiClient';
import { newPasswordSchema } from '@/_schema/newPassword';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

export const actionNewPassword = createServerAction()
  .input(newPasswordSchema.and(z.object({ token: z.string() })))
  .handler(async ({ input: { password, checkPassword, token } }) => {
    console.log('api', '/users/newpassword');
    try {
      await apiClient('/users/newpassword', {
        method: 'POST',
        body: JSON.stringify({ password, checkPassword, token }),
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new ZSAError('ERROR', error.message);
      }
      throw new ZSAError('ERROR', 'Erro ao alterar a senha.');
    }
  });
