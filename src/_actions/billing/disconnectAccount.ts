'use server';

import { assertProfessional } from '@/_lib/billingAuthorization';
import { toBillingActionError } from '@/_lib/billingActionError';
import { apiClient } from '@/_lib/apiClient';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const disconnectAccount = createServerAction().handler(async () => {
  const session = await auth();
  if (!session?.user) {
    throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
  }
  await assertProfessional();

  try {
    await apiClient('/billing/account', { method: 'DELETE' });
  } catch (error) {
    throw toBillingActionError('disconnectAccount', error);
  }
});
