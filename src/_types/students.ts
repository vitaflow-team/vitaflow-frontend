import type { FormRecord } from '@/_types/clinicalRecords';
import type { NextSessionSummary } from '@/_types/educatorSchedule';

/** Latest minus first weight-tagged value on record, in kg (1 decimal). */
export interface AssessmentVariation {
  weightKg: number;
}

export interface StudentListItem {
  id: string;
  name: string;
  email: string;
  hasAccount: boolean;
  lastAssessedOn: string | null;
  /** The next fixed session or booking with this educator, or null. */
  nextSession: NextSessionSummary | null;
}

export interface StudentList {
  items: StudentListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CurrentWorkoutSummary {
  id: string;
  title: string;
  weeklyFrequency: number | null;
  sessionNames: string[];
}

export interface StudentOverview {
  /** The next fixed session or booking with this educator, or null. */
  nextSession: NextSessionSummary | null;
  latest: FormRecord | null;
  variation: AssessmentVariation | null;
  /** The educator's active workout for this student, or null. */
  currentWorkout: CurrentWorkoutSummary | null;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string | null;
  hasAccount: boolean;
  /** The linked account id (key of the messages route), or null. */
  userId: string | null;
  createdAt: string;
  overview: StudentOverview;
}

export interface AccountLookup {
  found: boolean;
  name: string | null;
}
