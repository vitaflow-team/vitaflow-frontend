import { apiClient } from '@/_lib/apiClient';
import { createServerAction, ZSAError } from 'zsa';
import { signUpSchema } from '../_schema/signup';

export const actionSignUp = createServerAction()
  .input(signUpSchema)
  .handler(async ({ input: { name, email, password, checkPassword } }) => {
    try {
      return await apiClient('/users/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, checkPassword }),
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new ZSAError('ERROR', error.message);
      }
      throw new ZSAError('ERROR', 'Erro ao criar conta.');
    }
  });
