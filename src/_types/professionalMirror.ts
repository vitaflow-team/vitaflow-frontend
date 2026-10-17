import type { Bmi } from '@/_types/clinicalRecords';
import type { MealPlanMeal, MealPlanVersion, Weekday } from '@/_types/mealPlan';

export interface MirrorProfessional {
  id: string;
  name: string;
  specialty: string | null;
  /** Omitted entirely when never set — never sent as null (PRD ADR-009). */
  registrationNumber?: string;
  /** Present only alongside registrationNumber. */
  registrationLabel?: 'CRN' | 'CREF';
}

export interface MirrorAssessmentValue {
  fieldLabel: string;
  value: string | number | boolean | null;
}

/** One filled clinical-records FormRecord (anamnese or assessment) as the patient/student sees it. */
export interface MirrorAssessment {
  id: string;
  recordedAt: string;
  values: MirrorAssessmentValue[];
  bmi: Bmi | null;
}

export interface MirrorMealPlanDay {
  weekday: Weekday;
  meals: MealPlanMeal[];
}

/** The current published meal plan, with access to its full version history (ADR-008). */
export interface MirrorMealPlan {
  currentVersion: number;
  publishedAt: string;
  days: MirrorMealPlanDay[];
  versions: MealPlanVersion[];
}

/** One past published version's full content, fetched on demand. */
export interface MirrorMealPlanVersionContent {
  version: number;
  publishedAt: string;
  days: MirrorMealPlanDay[];
}

export interface NutritionistMirror {
  professional: MirrorProfessional;
  /** The patient's current anamnese answers, or null when none exist yet. */
  anamnese: MirrorAssessment | null;
  /** The patient's full assessment history, newest first; empty (never null) when none exist yet. */
  assessmentHistory: MirrorAssessment[];
  /** The current published meal plan, or null when none exists yet. */
  mealPlan: MirrorMealPlan | null;
  nextConsultation: null;
  billingStatus: null;
}

export interface MirrorWorkoutSession {
  id: string;
  /** A, B, C… from the position. */
  label: string;
  name: string;
  exerciseCount: number;
}

/**
 * The educator's active workout as a summary. "Today's workout" exists only
 * through the schedule, so no session is marked as today's (`todaySessionId`
 * stays null until the scheduling feature fills it).
 */
export interface MirrorWorkout {
  id: string;
  title: string;
  weeklyFrequency: number | null;
  sessions: MirrorWorkoutSession[];
  todaySessionId: string | null;
}

/** The student's next time with the educator: a fixed session or a booking. */
export interface MirrorNextSchedule {
  startAt: string;
  endAt: string;
  type: 'PRESENCIAL' | 'ONLINE';
  onlineLink: string | null;
  workoutLetter: string | null;
  workoutSessionName: string | null;
}

export interface EducatorMirror {
  professional: MirrorProfessional;
  /** The educator's active workout for this student, or null when none is active. */
  todayWorkout: MirrorWorkout | null;
  /** The next time with the educator, or null when none is scheduled. */
  nextSchedule: MirrorNextSchedule | null;
  /** The educator's latest assessments (up to three, newest first), or null when there are none. */
  physicalAssessment: MirrorAssessment[] | null;
  billingStatus: null;
}

export interface NoProfessionalMirror {
  hasProfessional: false;
}
