'use server';

import { TEMPLATE_ERRORS } from '@/_constants/clinicalRecordsErrors';
import { apiClient } from '@/_lib/apiClient';
import { assertEducator } from '@/_lib/studentsAuthorization';
import { TOO_MANY_REQUESTS, toSafeActionError } from '@/_lib/safeActionError';
import { createTemplateSchema } from '@/_schema/clinicalRecords';
import type { Template } from '@/_types/clinicalRecords';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const createTemplate = createServerAction()
  .input(createTemplateSchema)
  .handler(async ({ input }): Promise<Template> => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    await assertEducator();

    try {
      return await apiClient<Template>('/professionals/templates', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } catch (error) {
      throw toSafeActionError('educator/createTemplate', error, [
        ...TEMPLATE_ERRORS,
        TOO_MANY_REQUESTS,
      ]);
    }
  });
