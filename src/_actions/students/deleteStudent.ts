'use server';

import { STUDENT_WRITE_ERRORS } from '@/_constants/studentErrors';
import { apiClient } from '@/_lib/apiClient';
import { isBackendError } from '@/_lib/backendError';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { assertEducator } from '@/_lib/studentsAuthorization';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

/** A 404 means the student is already gone: the goal is met, so it succeeds. */
export const deleteStudent = createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }

    await assertEducator();
    const studentId = parseBackendId(input.id);

    try {
      await apiClient(`/educator/students/${studentId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      if (!isBackendError(error, 404)) {
        throw toSafeActionError('deleteStudent', error, STUDENT_WRITE_ERRORS);
      }
    }
  });
