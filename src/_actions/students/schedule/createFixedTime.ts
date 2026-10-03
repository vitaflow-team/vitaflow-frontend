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
import { createServerAction } from 'zsa';

/** Adds a fixed weekly time. A conflict is an outcome the form shows, nothing is saved. */
export const createFixedTime = createServerAction()
  .input(fixedTimeInputSchema)
  .handler(async ({ input }): Promise<FixedTimeWriteOutcome> => {
    await requireEducatorSession();
    const student = parseBackendId(input.studentId);
    const { studentId: _studentId, ...body } = input;

    try {
      const saved = await apiClient<FixedTime>(
        `/educator/students/${student}/schedule/fixed-times`,
        { method: 'POST', body: JSON.stringify(body) }
      );
      return { outcome: 'saved', fixedTime: saved };
    } catch (error) {
      if (isBackendError(error, 409, 'schedule_conflict')) {
        return { outcome: 'conflict', conflict: conflictOf(error)! };
      }
      if (isBackendError(error, 404)) return { outcome: 'not_found' };
      throw toSafeActionError('createFixedTime', error, SCHEDULE_WRITE_ERRORS);
    }
  });
