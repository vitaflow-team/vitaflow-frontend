'use server';

import { apiClient } from '@/_lib/apiClient';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

const deleteMeasurementRecordSchema = z.object({
  id: z.string().min(1),
});

export const deleteMeasurementRecord = createServerAction()
  .input(deleteMeasurementRecordSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      return await apiClient(`/progress-records/${input.id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      if (error instanceof ZSAError) throw error;
      const message =
        error instanceof Error ? error.message : 'Erro ao excluir medida.';
      throw new ZSAError('ERROR', message);
    }
  });
