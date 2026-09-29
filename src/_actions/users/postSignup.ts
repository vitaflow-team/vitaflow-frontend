'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError, TOO_MANY_REQUESTS } from '@/_lib/safeActionError';
import { signUpSchema } from '@/_schema/signup';
import type { ErrorMapping } from '@/_types/errorMapping';
import { createServerAction } from 'zsa';

const KNOWN_ERRORS: ErrorMapping[] = [
  // Password confirmation is already checked by the form schema, so a 400
  // here is the backend rejecting the data, most often an e-mail in use.
  {
    status: 400,
    message:
      'Não foi possível criar a conta. Verifique os dados ou use outro e-mail — este pode já estar cadastrado.',
  },
  TOO_MANY_REQUESTS,
];

export const actionSignUp = createServerAction()
  .input(signUpSchema)
  .handler(async ({ input }) => {
    try {
      return await apiClient('/users/signup', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } catch (error) {
      throw toSafeActionError('postSignup', error, KNOWN_ERRORS);
    }
  });
