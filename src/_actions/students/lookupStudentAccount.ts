'use server';

import { STUDENT_LOOKUP_ERRORS } from '@/_constants/studentErrors';
import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { assertEducator } from '@/_lib/studentsAuthorization';
import { lookupInputSchema } from '@/_schema/students';
import type { AccountLookup } from '@/_types/students';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

/**
 * Looks up a confirmed account by e-mail so the educator can confirm who it
 * belongs to. The answer is only `found` and the holder's name; a 429 gets its
 * own wait message and never says whether the e-mail has an account.
 */
export const lookupStudentAccount = createServerAction()
  .input(lookupInputSchema)
  .handler(async ({ input }): Promise<AccountLookup> => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }

    await assertEducator();

    try {
      return await apiClient<AccountLookup>(
        `/educator/students/account-lookup?email=${encodeURIComponent(input.email)}`,
        { method: 'GET', cache: 'no-store' }
      );
    } catch (error) {
      throw toSafeActionError(
        'lookupStudentAccount',
        error,
        STUDENT_LOOKUP_ERRORS
      );
    }
  });
