'use server';

import { apiClient } from '@/_lib/apiClient';
import { measurementRecordSchema } from '@/_schema/progress';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

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

    try {
      return await apiClient<MeasurementRecordResponseDTO>(
        `/progress-records/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(measurement),
        }
      );
    } catch (error) {
      if (error instanceof ZSAError) throw error;
      const message =
        error instanceof Error ? error.message : 'Erro ao atualizar medida.';
      throw new ZSAError('ERROR', message);
    }
  });
