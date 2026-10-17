'use server';

import { FORM_RECORD_ERRORS } from '@/_constants/clinicalRecordsErrors';
import { apiClient } from '@/_lib/apiClient';
import { isBackendError } from '@/_lib/backendError';
import { assertNutritionist } from '@/_lib/patientsAuthorization';
import { TOO_MANY_REQUESTS, toSafeActionError } from '@/_lib/safeActionError';
import { createFormRecordSchema } from '@/_schema/clinicalRecords';
import type { FormRecord } from '@/_types/clinicalRecords';
import type { CreateFormRecordOutcome } from '@/_types/createFormRecordOutcome';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

/**
 * A missing health-record consent surfaces as a typed outcome, not an error:
 * the caller opens the declaration dialog and resubmits with
 * `acceptDeclaration: true` rather than treating it as a failure.
 */
export const createFormRecord = createServerAction()
  .input(createFormRecordSchema)
  .handler(async ({ input }): Promise<CreateFormRecordOutcome> => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    await assertNutritionist();

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
      throw toSafeActionError('createFormRecord', error, [
        ...FORM_RECORD_ERRORS,
        TOO_MANY_REQUESTS,
      ]);
    }
  });
