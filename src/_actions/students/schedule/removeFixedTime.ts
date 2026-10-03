'use server';

import { SCHEDULE_WRITE_ERRORS } from '@/_constants/scheduleErrors';
import { apiClient } from '@/_lib/apiClient';
import { isBackendError } from '@/_lib/backendError';
import { requireEducatorSession } from '@/_lib/educatorSession';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import type { FixedTimeRemoveOutcome } from '@/_types/scheduleOutcomes';
import { z } from 'zod';
import { createServerAction } from 'zsa';

/**
 * Removes a fixed time and its future sessions. A 404 means it is already
 * gone, which is the result the educator asked for, so it is not an error.
 */
export const removeFixedTime = createServerAction()
  .input(z.object({ studentId: z.string(), fixedTimeId: z.string() }))
  .handler(async ({ input }): Promise<FixedTimeRemoveOutcome> => {
    await requireEducatorSession();
    const student = parseBackendId(input.studentId);
    const fixedTime = parseBackendId(input.fixedTimeId);

    try {
      await apiClient(
        `/educator/students/${student}/schedule/fixed-times/${fixedTime}`,
        { method: 'DELETE' }
      );
      return { outcome: 'removed' };
    } catch (error) {
      if (isBackendError(error, 404)) return { outcome: 'removed' };
      throw toSafeActionError('removeFixedTime', error, SCHEDULE_WRITE_ERRORS);
    }
  });
