'use server';

import { getEnv } from '@/_lib/getenv';
import { createServerAction, ZSAError } from 'zsa';
import { signUpSchema } from '../_schema/signup';

export const actionSignUp = createServerAction()
  .input(signUpSchema)
  .handler(async ({ input: { name, email, password, checkPassword } }) => {
    const response = await fetch(getEnv('BACKEND_URL') + '/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, checkPassword }),
      cache: 'no-store',
    }).catch(() => {
      throw new ZSAError(
        'ERROR',
        'Erro ao acessar o serviço de cadastro de novo usuário.'
      );
    });

    if (!response.ok) {
      const { message } = await response.json();

      throw new ZSAError('ERROR', message);
    } else {
      return await response.json();
    }
  });
