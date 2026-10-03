'use server';

import { STUDENT_WRITE_ERRORS } from '@/_constants/studentErrors';
import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { assertEducator } from '@/_lib/studentsAuthorization';
import { editStudentSchema } from '@/_schema/students';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

const updateInputSchema = editStudentSchema.extend({ id: z.string() });

export const updateStudent = createServerAction()
  .input(updateInputSchema)
  .handler(async ({ input: { id, ...changes } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }

    await assertEducator();
    const studentId = parseBackendId(id);

    try {
      await apiClient(`/educator/students/${studentId}`, {
        method: 'PATCH',
        body: JSON.stringify(changes),
      });
    } catch (error) {
      throw toSafeActionError('updateStudent', error, STUDENT_WRITE_ERRORS);
    }
  });
