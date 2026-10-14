'use server';

import { STUDENT_WRITE_ERRORS } from '@/_constants/studentErrors';
import { accountNameFor } from '@/_lib/accountLookup';
import { apiClient } from '@/_lib/apiClient';
import { isBackendError } from '@/_lib/backendError';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { assertEducator } from '@/_lib/studentsAuthorization';
import { editStudentSchema } from '@/_schema/students';
import type { UpdateStudentOutcome } from '@/_types/updateStudentOutcome';
import { auth } from '@/auth';
import { z } from 'zod';
import { createServerAction, ZSAError } from 'zsa';

const updateInputSchema = editStudentSchema.extend({
  id: z.string(),
  linkExistingAccount: z.boolean().optional(),
});

export const updateStudent = createServerAction()
  .input(updateInputSchema)
  .handler(
    async ({
      input: { id, linkExistingAccount, ...changes },
    }): Promise<UpdateStudentOutcome> => {
      const session = await auth();
      if (!session?.user) {
        throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
      }

      await assertEducator();
      const studentId = parseBackendId(id);

      try {
        await apiClient(`/educator/students/${studentId}`, {
          method: 'PATCH',
          body: JSON.stringify({ ...changes, linkExistingAccount }),
        });
        return { outcome: 'saved' };
      } catch (error) {
        if (isBackendError(error, 409, 'account_exists') && changes.email) {
          return {
            outcome: 'account_exists',
            email: changes.email,
            accountName: await accountNameFor(changes.email),
          };
        }
        throw toSafeActionError('updateStudent', error, STUDENT_WRITE_ERRORS);
      }
    }
  );
