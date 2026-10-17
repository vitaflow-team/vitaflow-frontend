'use server';

import { FORM_RECORD_ERRORS } from '@/_constants/clinicalRecordsErrors';
import { apiClient } from '@/_lib/apiClient';
import { assertNutritionist } from '@/_lib/patientsAuthorization';
import { TOO_MANY_REQUESTS, toSafeActionError } from '@/_lib/safeActionError';
import { updateFormRecordSchema } from '@/_schema/clinicalRecords';
import type { FormRecord } from '@/_types/clinicalRecords';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const updateFormRecord = createServerAction()
  .input(updateFormRecordSchema)
  .handler(async ({ input }): Promise<FormRecord> => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    await assertNutritionist();

    try {
      return await apiClient<FormRecord>(
        `/professionals/clients/${input.clientId}/form-records/${input.recordId}`,
        { method: 'PATCH', body: JSON.stringify({ values: input.values }) }
      );
    } catch (error) {
      throw toSafeActionError('updateFormRecord', error, [
        ...FORM_RECORD_ERRORS,
        TOO_MANY_REQUESTS,
      ]);
    }
  });
