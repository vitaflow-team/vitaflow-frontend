'use server';

import { TURMA_WRITE_ERRORS } from '@/_constants/academiaErrors';
import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { timeToMinutes } from '@/_lib/turmaSchedule';
import { createTurmaSchema } from '@/_schema/turmas';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const createTurma = createServerAction()
  .input(createTurmaSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();

    try {
      return await apiClient<{ id: string }>('/academia/turmas', {
        method: 'POST',
        body: JSON.stringify({
          name: input.name,
          weekday: input.weekday,
          startMinute: timeToMinutes(input.startTime),
          durationMinutes: input.durationMinutes,
          capacity: input.capacity,
          professionalId: input.professionalId || undefined,
        }),
      });
    } catch (error) {
      throw toSafeActionError('createTurma', error, TURMA_WRITE_ERRORS);
    }
  });
