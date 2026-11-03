'use server';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

const inputSchema = z.object({
  productId: z.string(),
});

interface CheckoutResponse {
  link: string;
}

// ADR-010: the backend owns the Asaas Checkout call entirely — this action
// is a thin, authenticated pass-through to it, never a gateway SDK call.
export const actionCreateCheckoutSession = createServerAction()
  .input(inputSchema)
  .handler(async ({ input: { productId } }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const productPathId = parseBackendId(productId);

    try {
      const { link } = await apiClient<CheckoutResponse>(
        '/users/subscription/checkout',
        {
          method: 'POST',
          body: JSON.stringify({ productId: productPathId }),
        }
      );

      return { url: link };
    } catch (error) {
      // Only a 400 is one of this endpoint's own hand-written business
      // messages — safe to show as-is. Any other status (500, a validation
      // pipe error, …) falls through to the generic fallback below, so an
      // unexpected backend message never reaches the user (ADR-010).
      if (error instanceof AppError && error.statusCode === 400) {
        console.error('Server Action "createCheckoutSession" failed.', {
          status: error.statusCode,
        });
        throw new ZSAError('ERROR', error.message);
      }
      throw toSafeActionError('createCheckoutSession', error);
    }
  });
