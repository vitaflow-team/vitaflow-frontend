'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { measurementRecordSchema } from '@/_schema/progress';
import type { ErrorMapping } from '@/_types/errorMapping';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

const KNOWN_ERRORS: ErrorMapping[] = [
  {
    status: 400,
    message: 'Verifique os valores informados e tente novamente.',
  },
];

export const createMeasurementRecord = createServerAction()
  .input(measurementRecordSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      return await apiClient<MeasurementRecordResponseDTO>(
        '/progress-records',
        {
          method: 'POST',
          body: JSON.stringify(input),
        }
      );
    } catch (error) {
      throw toSafeActionError('createMeasurementRecord', error, KNOWN_ERRORS);
    }
  });
