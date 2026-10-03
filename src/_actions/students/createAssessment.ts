'use server';

import { ASSESSMENT_WRITE_ERRORS } from '@/_constants/studentErrors';
import { apiClient } from '@/_lib/apiClient';
import { isBackendError } from '@/_lib/backendError';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { assertEducator } from '@/_lib/studentsAuthorization';
import { assessmentSchema } from '@/_schema/assessment';
import type { CreateAssessmentOutcome } from '@/_types/createAssessmentOutcome';
import type { Assessment } from '@/_types/students';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

const createInputSchema = assessmentSchema.extend({
  studentId: z.string(),
  acceptDeclaration: z.boolean().optional(),
});

/**
 * Without the one-time declaration on record the backend answers
 * `declaration_required`; that is a normal step of the flow, so it is an
 * outcome the form reacts to, not an error.
 */
export const createAssessment = createServerAction()
  .input(createInputSchema)
  .handler(async ({ input }): Promise<CreateAssessmentOutcome> => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }

    await assertEducator();
    const { studentId, ...values } = input;
    const id = parseBackendId(studentId);

    try {
      const assessment = await apiClient<Assessment>(
        `/educator/students/${id}/assessments`,
        { method: 'POST', body: JSON.stringify(values) }
      );
      return { outcome: 'saved', assessment };
    } catch (error) {
      if (isBackendError(error, 403, 'declaration_required')) {
        return { outcome: 'declaration_required' };
      }
      throw toSafeActionError(
        'createAssessment',
        error,
        ASSESSMENT_WRITE_ERRORS
      );
    }
  });
