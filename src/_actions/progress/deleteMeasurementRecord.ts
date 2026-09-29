'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import type { ErrorMapping } from '@/_types/errorMapping';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

const KNOWN_ERRORS: ErrorMapping[] = [
  { status: 401, message: 'Ação não permitida.' },
  { status: 404, message: 'Registro não encontrado.' },
];

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

    const id = parseBackendId(input.id);

    try {
      return await apiClient(`/progress-records/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      throw toSafeActionError('deleteMeasurementRecord', error, KNOWN_ERRORS);
    }
  });
