'use server';

import { assertProfessional } from '@/_lib/billingAuthorization';
import { toBillingActionError } from '@/_lib/billingActionError';
import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import {
  amountSchema,
  competenceMonthSchema,
  competenceYearSchema,
  dueDateSchema,
  taxIdSchema,
} from '@/_schema/billing';
import type { Invoice } from '@/_types/billing';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

// A flat, non-cross-validated input: the client-side form already enforces
// the competence window for the UX; the backend's own validateCompetence is
// the actual authority and answers `invoice_invalid` if bypassed.
const inputSchema = z.object({
  clientId: z.string(),
  competenceYear: competenceYearSchema,
  competenceMonth: competenceMonthSchema,
  amount: amountSchema,
  dueDate: dueDateSchema,
  cpfCnpj: taxIdSchema.optional(),
});

export const createInvoice = createServerAction()
  .input(inputSchema)
  .handler(async ({ input: { clientId, ...body } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertProfessional();
    const id = parseBackendId(clientId);

    try {
      return await apiClient<Invoice>(`/billing/students/${id}/invoices`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
    } catch (error) {
      throw toBillingActionError('createInvoice', error);
    }
  });
