import type { FixedTime } from '@/_types/educatorSchedule';

/** The other booking or fixed time that blocks a new or changed time. */
export interface ScheduleConflict {
  studentName: string;
  startAt: string;
  endAt: string;
}

/** What saving a fixed time reports; other failures are thrown as safe errors. */
export type FixedTimeWriteOutcome =
  | { outcome: 'saved'; fixedTime: FixedTime }
  | { outcome: 'conflict'; conflict: ScheduleConflict }
  | { outcome: 'not_found' };

/** Removing treats an already removed time as done: only other failures are errors. */
export type FixedTimeRemoveOutcome = { outcome: 'removed' };
