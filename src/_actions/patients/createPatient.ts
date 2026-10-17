'use server';

import { PATIENT_ERRORS } from '@/_constants/patientErrors';
import { apiClient } from '@/_lib/apiClient';
import { TOO_MANY_REQUESTS, toSafeActionError } from '@/_lib/safeActionError';
import { assertNutritionist } from '@/_lib/patientsAuthorization';
import { registerPatientSchema } from '@/_schema/patients';
import type { NutritionistPatient } from '@/_types/patients';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const createPatient = createServerAction()
  .input(registerPatientSchema)
  .handler(async ({ input }): Promise<NutritionistPatient> => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    await assertNutritionist();

    try {
      return await apiClient<NutritionistPatient>('/nutritionist/patients', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } catch (error) {
      throw toSafeActionError('createPatient', error, [
        ...PATIENT_ERRORS,
        TOO_MANY_REQUESTS,
      ]);
    }
  });
