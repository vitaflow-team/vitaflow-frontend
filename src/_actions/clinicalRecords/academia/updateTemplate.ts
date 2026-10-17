'use server';

import { TEMPLATE_ERRORS } from '@/_constants/clinicalRecordsErrors';
import { apiClient } from '@/_lib/apiClient';
import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
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

    await assertAcademiaOwner();

    const { id, ...body } = input;
    try {
      return await apiClient<Template>(`/academia/templates/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
    } catch (error) {
      throw toSafeActionError('academia/updateTemplate', error, [
        ...TEMPLATE_ERRORS,
        TOO_MANY_REQUESTS,
      ]);
    }
  });
