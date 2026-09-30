'use server';

import { apiClient } from '@/_lib/apiClient';
import { toExercisePayload } from '@/_lib/exercisePayload';
import { toSafeActionError } from '@/_lib/safeActionError';
import { exerciseCatalogSchema } from '@/_schema/exerciseCatalog';
import type { ErrorMapping } from '@/_types/errorMapping';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

// 409 is the backend spotting the same submission sent twice within minutes
// (a double click or a retry), which the educator must hear about (US-006.EC-3).
const KNOWN_ERRORS: ErrorMapping[] = [
  {
    status: 400,
    message: 'Verifique os dados do exercício e tente novamente.',
  },
  {
    status: 403,
    message: 'Apenas educadores físicos podem sugerir exercícios.',
  },
  {
    status: 409,
    message:
      'Você acabou de enviar este mesmo exercício. Ele já está aguardando revisão.',
  },
];

/** An educator proposes an exercise; it waits for backoffice review (US-006). */
export const submitExercise = createServerAction()
  .input(exerciseCatalogSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      await apiClient('/exercises/submissions', {
        method: 'POST',
        body: JSON.stringify(toExercisePayload(input)),
      });
    } catch (error) {
      throw toSafeActionError('submitExercise', error, KNOWN_ERRORS);
    }
  });
