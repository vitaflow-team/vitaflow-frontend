'use server';

import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { toBillingActionError } from '@/_lib/billingActionError';
import { parseAcademiaId } from '@/_lib/idValidation';
import {
  activateBillingSchema,
  type ActivationItemInput,
} from '@/_schema/gymBilling';
import type { ActivationResult } from '@/_types/activationResult';
import { auth } from '@/auth';
import { ZSAError, createServerAction } from 'zsa';

/** Starts the monthly billing of up to 200 students already linked to a plan. */
export const activateBilling = createServerAction()
  .input(activateBillingSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();
    const checked = input.items.map((item: ActivationItemInput) => ({
      ...item,
      clientId: parseAcademiaId(item.clientId),
    }));

    try {
      return await apiClient<ActivationResult>(
        '/academia/students/billing/activate',
        { method: 'POST', body: JSON.stringify({ items: checked }) }
      );
    } catch (error) {
      throw toBillingActionError('activateBilling', error);
    }
  });
