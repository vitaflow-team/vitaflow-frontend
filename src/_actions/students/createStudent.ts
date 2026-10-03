'use server';

import {
  ACCOUNT_NOT_FOUND_MESSAGE,
  SELF_REGISTRATION_MESSAGE,
  STUDENT_VALIDATION,
} from '@/_constants/studentErrors';
import { accountNameFor } from '@/_lib/accountLookup';
import { apiClient } from '@/_lib/apiClient';
import { isBackendError } from '@/_lib/backendError';
import { TOO_MANY_REQUESTS, toSafeActionError } from '@/_lib/safeActionError';
import { assertEducator } from '@/_lib/studentsAuthorization';
import { createStudentInputSchema } from '@/_schema/students';
import type { CreateStudentOutcome } from '@/_types/createStudentOutcome';
import type { ErrorMapping } from '@/_types/errorMapping';
import type { Student } from '@/_types/students';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

const CREATE_ERRORS: ErrorMapping[] = [
  {
    status: 400,
    code: 'self_registration',
    message: SELF_REGISTRATION_MESSAGE,
  },
  STUDENT_VALIDATION,
  {
    status: 404,
    code: 'account_not_found',
    message: ACCOUNT_NOT_FOUND_MESSAGE,
  },
  TOO_MANY_REQUESTS,
];

export const createStudent = createServerAction()
  .input(createStudentInputSchema)
  .handler(async ({ input }): Promise<CreateStudentOutcome> => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }

    await assertEducator();

    try {
      const student = await apiClient<Student>('/educator/students', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      return { outcome: 'created', id: student.id };
    } catch (error) {
      if (isBackendError(error, 409, 'student_already_registered')) {
        return { outcome: 'already_registered' };
      }
      if (isBackendError(error, 409, 'account_exists')) {
        return {
          outcome: 'account_exists',
          accountName: await accountNameFor(input.email),
        };
      }
      throw toSafeActionError('createStudent', error, CREATE_ERRORS);
    }
  });
