'use server';

import { ASSESSMENT_WRITE_ERRORS } from '@/_constants/studentErrors';
import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { assertEducator } from '@/_lib/studentsAuthorization';
import { assessmentSchema } from '@/_schema/assessment';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

const updateInputSchema = assessmentSchema.extend({
  studentId: z.string(),
  assessmentId: z.string(),
});

/** A full replace: a value left empty clears what was saved. */
export const updateAssessment = createServerAction()
  .input(updateInputSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }

    await assertEducator();
    const { studentId, assessmentId, ...values } = input;
    const student = parseBackendId(studentId);
    const assessment = parseBackendId(assessmentId);

    try {
      await apiClient(
        `/educator/students/${student}/assessments/${assessment}`,
        { method: 'PATCH', body: JSON.stringify(values) }
      );
    } catch (error) {
      throw toSafeActionError(
        'updateAssessment',
        error,
        ASSESSMENT_WRITE_ERRORS
      );
    }
  });
