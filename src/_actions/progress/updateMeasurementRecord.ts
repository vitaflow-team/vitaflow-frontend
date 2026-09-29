'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { measurementRecordSchema } from '@/_schema/progress';
import type { ErrorMapping } from '@/_types/errorMapping';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

const KNOWN_ERRORS: ErrorMapping[] = [
  {
    status: 400,
    message: 'Verifique os valores informados e tente novamente.',
  },
  { status: 401, message: 'Ação não permitida.' },
  { status: 404, message: 'Registro não encontrado.' },
];

const updateMeasurementRecordSchema = measurementRecordSchema.extend({
  id: z.string().min(1),
});

export const updateMeasurementRecord = createServerAction()
  .input(updateMeasurementRecordSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const { id, ...measurement } = input;
    const recordId = parseBackendId(id);

    try {
      return await apiClient<MeasurementRecordResponseDTO>(
        `/progress-records/${recordId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(measurement),
        }
      );
    } catch (error) {
      throw toSafeActionError('updateMeasurementRecord', error, KNOWN_ERRORS);
    }
  });
