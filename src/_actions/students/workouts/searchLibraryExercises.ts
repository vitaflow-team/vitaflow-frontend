'use server';

import { LIBRARY_SEARCH_ERRORS } from '@/_constants/workoutErrors';
import { apiClient } from '@/_lib/apiClient';
import { requireEducatorSession } from '@/_lib/educatorSession';
import { toSafeActionError } from '@/_lib/safeActionError';
import type { Exercise } from '@/_types/exercise';
import { z } from 'zod';
import { createServerAction } from 'zsa';

/**
 * Searches the approved exercise library by name. The text goes to the backend
 * encoded as plain text, whatever it contains (`%`, `_`, quotes, markup).
 */
export const searchLibraryExercises = createServerAction()
  .input(z.object({ q: z.string().trim().min(1).max(100) }))
  .handler(async ({ input }): Promise<Exercise[]> => {
    await requireEducatorSession();

    try {
      return await apiClient<Exercise[]>(
        `/exercises?q=${encodeURIComponent(input.q)}`,
        { method: 'GET', cache: 'no-store' }
      );
    } catch (error) {
      throw toSafeActionError(
        'searchLibraryExercises',
        error,
        LIBRARY_SEARCH_ERRORS
      );
    }
  });
