'use server';

import { createServerAction, ZSAError } from 'zsa';
import { singUpSchema } from '../_schema/singup';

export const actionSingUp = createServerAction()
  .input(singUpSchema)
  .handler(async ({ input: { name, email, password, checkPassword } }) => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/users/singup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, checkPassword }),
        cache: 'no-store',
      }
    ).catch(() => {
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
