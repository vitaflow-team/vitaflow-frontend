'use server';

import { apiClient } from '@/_lib/apiClient';
import { resetPasswordSchema } from '@/_schema/resetPassword';
import { createServerAction, ZSAError } from 'zsa';

export const actionResetPassword = createServerAction()
  .input(resetPasswordSchema)
  .handler(async ({ input: { email } }) => {
    try {
      await apiClient('/users/recoverpass', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new ZSAError('ERROR', error.message);
      }
      throw new ZSAError('ERROR', 'Erro ao solicitar recuperação de senha.');
    }
  });
