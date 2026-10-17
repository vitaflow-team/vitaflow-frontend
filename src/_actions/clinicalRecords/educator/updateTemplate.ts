'use server';

import { TEMPLATE_ERRORS } from '@/_constants/clinicalRecordsErrors';
import { apiClient } from '@/_lib/apiClient';
import { assertEducator } from '@/_lib/studentsAuthorization';
import { TOO_MANY_REQUESTS, toSafeActionError } from '@/_lib/safeActionError';
import { updateTemplateSchema } from '@/_schema/clinicalRecords';
import type { Template } from '@/_types/clinicalRecords';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { z } from 'zod';

const inputSchema = z
  .object({ id: z.uuid() })
  .extend(updateTemplateSchema.shape);

export const updateTemplate = createServerAction()
  .input(inputSchema)
  .handler(async ({ input }): Promise<Template> => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    await assertEducator();

    const { id, ...body } = input;
    try {
      return await apiClient<Template>(`/professionals/templates/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
    } catch (error) {
      throw toSafeActionError('educator/updateTemplate', error, [
        ...TEMPLATE_ERRORS,
        TOO_MANY_REQUESTS,
      ]);
    }
  });
