'use server';

import { TEMPLATE_ERRORS } from '@/_constants/clinicalRecordsErrors';
import { apiClient } from '@/_lib/apiClient';
import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { TOO_MANY_REQUESTS, toSafeActionError } from '@/_lib/safeActionError';
import { discontinueTemplateSchema } from '@/_schema/clinicalRecords';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const discontinueTemplate = createServerAction()
  .input(discontinueTemplateSchema)
  .handler(async ({ input }): Promise<void> => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    await assertAcademiaOwner();

    try {
      await apiClient<void>(`/academia/templates/${input.id}/discontinue`, {
        method: 'POST',
      });
    } catch (error) {
      throw toSafeActionError('academia/discontinueTemplate', error, [
        ...TEMPLATE_ERRORS,
        TOO_MANY_REQUESTS,
      ]);
    }
  });
