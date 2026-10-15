'use server';

import { REGISTER_ACADEMIA_STUDENT_ERRORS } from '@/_constants/academiaErrors';
import { assertAcademiaOwner } from '@/_lib/academiaAuthorization';
import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { registerAcademiaStudentSchema } from '@/_schema/academiaAlunos';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const registerAcademiaStudent = createServerAction()
  .input(registerAcademiaStudentSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    await assertAcademiaOwner();

    try {
      const student = await apiClient<{ id: string }>('/academia/students', {
        method: 'POST',
        body: JSON.stringify({ ...input, linkExistingAccount: false }),
      });
      return { id: student.id };
    } catch (error) {
      throw toSafeActionError(
        'registerAcademiaStudent',
        error,
        REGISTER_ACADEMIA_STUDENT_ERRORS
      );
    }
  });
