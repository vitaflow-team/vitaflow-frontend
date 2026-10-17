'use server';

import { FORM_RECORD_ERRORS } from '@/_constants/clinicalRecordsErrors';
import { apiClient } from '@/_lib/apiClient';
import { isBackendError } from '@/_lib/backendError';
import { assertEducator } from '@/_lib/studentsAuthorization';
import { TOO_MANY_REQUESTS, toSafeActionError } from '@/_lib/safeActionError';
import { createFormRecordSchema } from '@/_schema/clinicalRecords';
import type { FormRecord } from '@/_types/clinicalRecords';
import type { CreateFormRecordOutcome } from '@/_types/createFormRecordOutcome';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

/**
 * Same route and declaration-gate behavior as the nutritionist's
 * createFormRecord — only the caller-type check differs (US-022, this is
 * the physical educator's own private students, never an academia's).
 */
export const createFormRecord = createServerAction()
  .input(createFormRecordSchema)
  .handler(async ({ input }): Promise<CreateFormRecordOutcome> => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    await assertEducator();

    const { clientId, ...body } = input;
    try {
      const record = await apiClient<FormRecord>(
        `/professionals/clients/${clientId}/form-records`,
        { method: 'POST', body: JSON.stringify(body) }
      );
      return { outcome: 'created', record };
    } catch (error) {
      if (isBackendError(error, 403, 'declaration_required')) {
        return { outcome: 'declaration_required' };
      }
      throw toSafeActionError('educator/createFormRecord', error, [
        ...FORM_RECORD_ERRORS,
        TOO_MANY_REQUESTS,
      ]);
    }
  });
