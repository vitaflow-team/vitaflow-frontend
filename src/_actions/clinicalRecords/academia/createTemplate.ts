'use server';

import { TEMPLATE_ERRORS } from '@/_constants/clinicalRecordsErrors';
import { apiClient } from '@/_lib/apiClient';
import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { TOO_MANY_REQUESTS, toSafeActionError } from '@/_lib/safeActionError';
import { createTemplateSchema } from '@/_schema/clinicalRecords';
import type { Template } from '@/_types/clinicalRecords';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

/** The academia's own shared catalog, owner/manager only (ADR-004/US-024). */
export const createTemplate = createServerAction()
  .input(createTemplateSchema)
  .handler(async ({ input }): Promise<Template> => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    await assertAcademiaOwner();

    try {
      return await apiClient<Template>('/academia/templates', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } catch (error) {
      throw toSafeActionError('academia/createTemplate', error, [
        ...TEMPLATE_ERRORS,
        TOO_MANY_REQUESTS,
      ]);
    }
  });
