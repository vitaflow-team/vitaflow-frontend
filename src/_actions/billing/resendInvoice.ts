'use server';

import { assertProfessional } from '@/_lib/billingAuthorization';
import { toBillingActionError } from '@/_lib/billingActionError';
import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

export const resendInvoice = createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertProfessional();
    const id = parseBackendId(input.id);

    try {
      await apiClient(`/billing/invoices/${id}/resend`, { method: 'POST' });
    } catch (error) {
      throw toBillingActionError('resendInvoice', error);
    }
  });
