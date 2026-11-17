'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { customerActivationSchema } from '@/_schema/customerActivation';
import type { ErrorMapping } from '@/_types/errorMapping';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

const KNOWN_ERRORS: ErrorMapping[] = [
  {
    status: 409,
    code: 'already_customer',
    message: 'Sua conta já utiliza o Vita Flow como cliente.',
  },
  {
    status: 500,
    message:
      'Não foi possível ativar agora: o plano Gratuito está indisponível. Tente novamente mais tarde.',
  },
];

/**
 * Turns a plan-less account (created by a staff invitation) into a customer
 * on the Gratuito plan, recording both consents (US-011). Acts on the
 * signed-in account only — no identifier is sent.
 */
export const activateAsCustomer = createServerAction()
  .input(customerActivationSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      await apiClient('/profile/customer-activation', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } catch (error) {
      throw toSafeActionError('activateAsCustomer', error, KNOWN_ERRORS);
    }
  });
