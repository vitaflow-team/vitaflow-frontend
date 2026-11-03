'use server';

import { assertProfessional } from '@/_lib/billingAuthorization';
import { toBillingActionError } from '@/_lib/billingActionError';
import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { taxIdSchema } from '@/_schema/billing';
import type { TaxId } from '@/_types/billing';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

const inputSchema = z.object({
  clientId: z.string(),
  cpfCnpj: taxIdSchema,
});

export const setTaxId = createServerAction()
  .input(inputSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertProfessional();
    const id = parseBackendId(input.clientId);

    try {
      return await apiClient<TaxId>(`/billing/students/${id}/tax-id`, {
        method: 'PUT',
        body: JSON.stringify({ cpfCnpj: input.cpfCnpj }),
      });
    } catch (error) {
      throw toBillingActionError('setTaxId', error);
    }
  });
