'use server';

import { assertProfessional } from '@/_lib/billingAuthorization';
import { toBillingActionError } from '@/_lib/billingActionError';
import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { noteSchema, paidOnSchema } from '@/_schema/billing';
import type { Invoice } from '@/_types/billing';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

const inputSchema = z.object({
  id: z.string(),
  paidOn: paidOnSchema,
  note: noteSchema,
});

export const markPaidInvoice = createServerAction()
  .input(inputSchema)
  .handler(async ({ input: { id, ...body } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertProfessional();
    const invoiceId = parseBackendId(id);

    try {
      return await apiClient<Invoice>(
        `/billing/invoices/${invoiceId}/mark-paid`,
        { method: 'POST', body: JSON.stringify(body) }
      );
    } catch (error) {
      throw toBillingActionError('markPaidInvoice', error);
    }
  });
