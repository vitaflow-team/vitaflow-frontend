'use server';

import { SCHEDULE_WRITE_ERRORS } from '@/_constants/scheduleErrors';
import { apiClient } from '@/_lib/apiClient';
import { isBackendError } from '@/_lib/backendError';
import { requireEducatorSession } from '@/_lib/educatorSession';
import { conflictOf } from '@/_lib/scheduleConflict';
import { parseBackendId } from '@/_lib/idValidation';
import { fixedTimeInputSchema } from '@/_schema/fixedTimeActionInput';
import { toSafeActionError } from '@/_lib/safeActionError';
import type { FixedTime } from '@/_types/educatorSchedule';
import type { FixedTimeWriteOutcome } from '@/_types/scheduleOutcomes';
import { z } from 'zod';
import { createServerAction } from 'zsa';

const updateInputSchema = fixedTimeInputSchema.extend({
  fixedTimeId: z.string(),
});

/** Changes a fixed time from now on; only future sessions follow it. */
export const updateFixedTime = createServerAction()
  .input(updateInputSchema)
  .handler(async ({ input }): Promise<FixedTimeWriteOutcome> => {
    await requireEducatorSession();
    const student = parseBackendId(input.studentId);
    const fixedTime = parseBackendId(input.fixedTimeId);
    const { studentId: _studentId, fixedTimeId: _fixedTimeId, ...body } = input;

    try {
      const saved = await apiClient<FixedTime>(
        `/educator/students/${student}/schedule/fixed-times/${fixedTime}`,
        { method: 'PATCH', body: JSON.stringify(body) }
      );
      return { outcome: 'saved', fixedTime: saved };
    } catch (error) {
      if (isBackendError(error, 409, 'schedule_conflict')) {
        return { outcome: 'conflict', conflict: conflictOf(error)! };
      }
      if (isBackendError(error, 404)) return { outcome: 'not_found' };
      throw toSafeActionError('updateFixedTime', error, SCHEDULE_WRITE_ERRORS);
    }
  });
