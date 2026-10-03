import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import type { LoadFailure } from '@/_types/loadFailure';
import type { StudentSchedule } from '@/_types/educatorSchedule';
import { unstable_rethrow } from 'next/navigation';
import { z } from 'zod';

const uuidSchema = z.uuid();

function toFailure(error: unknown): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  console.error('Schedule: load failed.', { status });
  return 'failed';
}

/** The student's fixed times and the next 28 days of sessions. A malformed id is "not found" without a request. */
export async function loadSchedule(
  studentId: string
): Promise<StudentSchedule | LoadFailure> {
  if (!uuidSchema.safeParse(studentId).success) return 'not-found';

  try {
    return await apiClient<StudentSchedule>(
      `/educator/students/${studentId}/schedule`,
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    return toFailure(error);
  }
}
