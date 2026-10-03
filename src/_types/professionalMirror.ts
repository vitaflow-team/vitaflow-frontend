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

export interface EducatorMirror {
  professional: MirrorProfessional;
  todayWorkout: null;
  nextSchedule: null;
  /** The educator's latest assessments (up to three, newest first), or null when there are none. */
  physicalAssessment: MirrorAssessment[] | null;
  billingStatus: null;
}

export interface NoProfessionalMirror {
  hasProfessional: false;
}
