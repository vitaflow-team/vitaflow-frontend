'use server';

import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { toBillingActionError } from '@/_lib/billingActionError';
import { parseAcademiaId } from '@/_lib/idValidation';
import { changeBillingTermsSchema } from '@/_schema/gymBilling';
import type { RecurringBilling } from '@/_types/recurringBilling';
import { auth } from '@/auth';
import { ZSAError, createServerAction } from 'zsa';

/** Changes the due day and/or the amount of fees not yet issued. */
export const changeBillingTerms = createServerAction()
  .input(changeBillingTermsSchema)
  .handler(async ({ input: { clientId, dueDay, amountCents } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();
    const id = parseAcademiaId(clientId);

    try {
      return await apiClient<RecurringBilling>(
        `/academia/students/${id}/billing`,
        { method: 'PATCH', body: JSON.stringify({ dueDay, amountCents }) }
      );
    } catch (error) {
      throw toBillingActionError('changeBillingTerms', error);
    }
  });
