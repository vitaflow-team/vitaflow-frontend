'use server';

import { apiClient } from '@/_lib/apiClient';
import { measurementRecordSchema } from '@/_schema/progress';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

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
      if (error instanceof ZSAError) throw error;
      const message =
        error instanceof Error ? error.message : 'Erro ao registrar medida.';
      throw new ZSAError('ERROR', message);
    }
  });
