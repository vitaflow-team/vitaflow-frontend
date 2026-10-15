'use server';

import { TURMA_WRITE_ERRORS } from '@/_constants/academiaErrors';
import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { parseAcademiaId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { timeToMinutes } from '@/_lib/turmaSchedule';
import { turmaScheduleSchema } from '@/_schema/turmas';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

export const updateTurma = createServerAction()
  .input(turmaScheduleSchema.extend({ turmaId: z.string() }))
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();
    const id = parseAcademiaId(input.turmaId);

    try {
      return await apiClient<{ id: string }>(`/academia/turmas/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: input.name,
          weekday: input.weekday,
          startMinute: timeToMinutes(input.startTime),
          durationMinutes: input.durationMinutes,
          capacity: input.capacity,
        }),
      });
    } catch (error) {
      throw toSafeActionError('updateTurma', error, TURMA_WRITE_ERRORS);
    }
  });
