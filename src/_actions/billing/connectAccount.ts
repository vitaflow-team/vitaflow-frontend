'use server';

import { assertProfessional } from '@/_lib/billingAuthorization';
import { toBillingActionError } from '@/_lib/billingActionError';
import { apiClient } from '@/_lib/apiClient';
import { connectAccountSchema } from '@/_schema/billing';
import type { BillingAccount } from '@/_types/billing';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const connectAccount = createServerAction()
  .input(connectAccountSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertProfessional();

    try {
      return await apiClient<BillingAccount>('/billing/account', {
        method: 'PUT',
        body: JSON.stringify({ apiKey: input.apiKey }),
      });
    } catch (error) {
      throw toBillingActionError('connectAccount', error);
    }
  });
