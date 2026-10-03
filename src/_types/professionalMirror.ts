export interface MirrorProfessional {
  id: string;
  name: string;
  specialty: string | null;
}

// The binding read contract (backend TechSpec § Core Interfaces): every
// field below besides `professional` is always null today — no feature yet
// writes it. Typed as the literal `null`, not `T | null`, because nothing in
// this codebase's scope ever produces another value for it.
export interface NutritionistMirror {
  professional: MirrorProfessional;
  mealPlan: null;
  nextConsultation: null;
  billingStatus: null;
}

export interface MirrorAssessment {
  id: string;
  /** Calendar date, `YYYY-MM-DD`. */
  assessedOn: string;
  weightKg: number;
  bodyFatPercent: number | null;
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

export interface EducatorMirror {
  professional: MirrorProfessional;
  /** The educator's active workout for this student, or null when none is active. */
  todayWorkout: MirrorWorkout | null;
  nextSchedule: null;
  /** The educator's latest assessments (up to three, newest first), or null when there are none. */
  physicalAssessment: MirrorAssessment[] | null;
  billingStatus: null;
}

export interface NoProfessionalMirror {
  hasProfessional: false;
}
