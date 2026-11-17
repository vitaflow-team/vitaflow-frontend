'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError, TOO_MANY_REQUESTS } from '@/_lib/safeActionError';
import { acceptStaffInvitationSchema } from '@/_schema/backoffice';
import type { ErrorMapping } from '@/_types/errorMapping';
import { createServerAction } from 'zsa';

const KNOWN_ERRORS: ErrorMapping[] = [
  {
    status: 400,
    code: 'invalid_token',
    message: 'Link de convite inválido ou expirado. Peça um novo convite.',
  },
  {
    status: 401,
    code: 'invalid_password',
    message: 'Senha incorreta. Confira e tente novamente.',
  },
  {
    status: 409,
    code: 'account_inactive',
    message: 'Ative sua conta antes de aceitar o convite para a equipe.',
  },
  TOO_MANY_REQUESTS,
];

/**
 * Accepts a staff invitation on an existing account, proving its current
 * password (US-008). A wrong password keeps the link valid on the backend,
 * so the form can simply be submitted again.
 */
export const acceptStaffInvitation = createServerAction()
  .input(acceptStaffInvitationSchema)
  .handler(async ({ input: { token, password } }) => {
    try {
      await apiClient('/backoffice/staff/accept', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
    } catch (error) {
      throw toSafeActionError('acceptStaffInvitation', error, KNOWN_ERRORS);
    }
  });
