export interface AssessmentVariation {
  /** Latest minus first weight, in kg (1 decimal). */
  weightKg: number;
  /** Change in percentage points, or null when fewer than two have body fat. */
  bodyFatPoints: number | null;
}

export interface Assessment {
  id: string;
  studentId: string;
  /** Calendar date, `YYYY-MM-DD`. */
  assessedOn: string;
  weightKg: number;
  heightCm: number;
  bodyFatPercent: number | null;
  restingHeartRate: number | null;
  flexibilityCm: number | null;
  armCm: number | null;
  chestCm: number | null;
  waistCm: number | null;
  abdomenCm: number | null;
  hipCm: number | null;
  thighCm: number | null;
  calfCm: number | null;
  createdAt: string;
}

export interface AssessmentList {
  items: Assessment[];
  total: number;
  page: number;
  pageSize: number;
  variation: AssessmentVariation | null;
}

export interface StudentListItem {
  id: string;
  name: string;
  email: string;
  hasAccount: boolean;
  lastAssessedOn: string | null;
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
  latest: Assessment | null;
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
