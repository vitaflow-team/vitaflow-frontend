'use server';

import { TEMPLATE_ERRORS } from '@/_constants/clinicalRecordsErrors';
import { apiClient } from '@/_lib/apiClient';
import { assertNutritionist } from '@/_lib/patientsAuthorization';
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

    await assertNutritionist();

    try {
      await apiClient<void>(
        `/professionals/templates/${input.id}/discontinue`,
        {
          method: 'POST',
        }
      );
    } catch (error) {
      throw toSafeActionError('discontinueTemplate', error, [
        ...TEMPLATE_ERRORS,
        TOO_MANY_REQUESTS,
      ]);
    }
  });
