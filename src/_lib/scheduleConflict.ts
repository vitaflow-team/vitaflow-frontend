import { AppError } from '@/_lib/AppError';
import type { ScheduleConflict } from '@/_types/scheduleOutcomes';

/** The conflict a 409 `schedule_conflict` carries in its details, or null. */
export function conflictOf(error: unknown): ScheduleConflict | null {
  const details = error instanceof AppError ? error.details : undefined;
  return details && typeof details === 'object'
    ? (details as ScheduleConflict)
    : null;
}
