'use server';

import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { toBillingActionError } from '@/_lib/billingActionError';
import { parseAcademiaId } from '@/_lib/idValidation';
import { assignAccessPlanSchema } from '@/_schema/gymBilling';
import type { AssignAccessPlanResult } from '@/_types/assignAccessPlanResult';
import { auth } from '@/auth';
import { ZSAError, createServerAction } from 'zsa';

export const assignAccessPlan = createServerAction()
  .input(assignAccessPlanSchema)
  .handler(async ({ input: { clientId, accessPlanId, billing } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();
    const id = parseAcademiaId(clientId);

    try {
      return await apiClient<AssignAccessPlanResult>(
        `/academia/students/${id}/access-plan`,
        { method: 'POST', body: JSON.stringify({ accessPlanId, billing }) }
      );
    } catch (error) {
      throw toBillingActionError('assignAccessPlan', error);
    }
  });
