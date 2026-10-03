'use server';

import { ASSESSMENT_WRITE_ERRORS } from '@/_constants/studentErrors';
import { apiClient } from '@/_lib/apiClient';
import { isBackendError } from '@/_lib/backendError';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { assertEducator } from '@/_lib/studentsAuthorization';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

/** A 404 means the assessment is already gone: the goal is met. */
export const deleteAssessment = createServerAction()
  .input(z.object({ studentId: z.string(), assessmentId: z.string() }))
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }

    await assertEducator();
    const student = parseBackendId(input.studentId);
    const assessment = parseBackendId(input.assessmentId);

    try {
      await apiClient(
        `/educator/students/${student}/assessments/${assessment}`,
        { method: 'DELETE' }
      );
    } catch (error) {
      if (!isBackendError(error, 404)) {
        throw toSafeActionError(
          'deleteAssessment',
          error,
          ASSESSMENT_WRITE_ERRORS
        );
      }
    }
  });
