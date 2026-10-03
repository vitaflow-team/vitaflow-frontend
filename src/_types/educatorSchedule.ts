export type ScheduleSessionType = 'PRESENCIAL' | 'ONLINE';

/** A fixed weekly time of one student, with its letter resolved against the active workout. */
export interface FixedTime {
  id: string;
  weekday: number;
  /** Minutes from midnight in Brasília time. */
  startMinute: number;
  durationMinutes: number;
  type: ScheduleSessionType;
  onlineLink: string | null;
  workoutLetter: string | null;
  workoutSessionName: string | null;
  /** True when the letter names a session the active workout does not have. */
  workoutMissing: boolean;
}

/** One coming session: a fixed session (canceled ones are marked) or a booking. */
export interface UpcomingSession {
  id: string;
  source: 'FIXED' | 'BOOKING';
  startAt: string;
  endAt: string;
  type: ScheduleSessionType;
  onlineLink: string | null;
  status: 'SCHEDULED' | 'CANCELED' | 'BOOKED';
  workoutLetter: string | null;
  workoutSessionName: string | null;
}

export interface StudentSchedule {
  fixedTimes: FixedTime[];
  upcoming: UpcomingSession[];
}

/** The next time with an educator, shown on the overview and the student list. */
export interface NextSessionSummary {
  startAt: string;
  type: ScheduleSessionType;
}
