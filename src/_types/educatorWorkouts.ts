import type { ExerciseContraindication } from '@/_types/exerciseContraindication';
import type { ExerciseEquipment } from '@/_types/exerciseEquipment';

export type WorkoutStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type ExerciseSource = 'LIBRARY' | 'FREE';

export interface WorkoutSummary {
  id: string;
  title: string;
  status: WorkoutStatus;
  weeklyFrequency: number | null;
  sessionCount: number;
  exerciseCount: number;
  updatedAt: string;
}

export interface WorkoutList {
  active: WorkoutSummary | null;
  drafts: WorkoutSummary[];
  archived: {
    items: WorkoutSummary[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface WorkoutExercise {
  id: string;
  source: ExerciseSource;
  exerciseId: string | null;
  name: string;
  muscleGroup: string;
  equipment: ExerciseEquipment | null;
  sets: number;
  reps: string;
  load: string | null;
  /** The educator's own link. */
  videoUrl: string | null;
  /** The library video, while the reference still exists. */
  libraryVideoUrl: string | null;
  /** The student restrictions this exercise runs into. */
  conflicts: ExerciseContraindication[];
}

export interface WorkoutSession {
  id: string;
  /** A, B, C… from the position. */
  label: string;
  name: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutTree {
  id: string;
  title: string;
  status: WorkoutStatus;
  weeklyFrequency: number | null;
  updatedAt: string;
  sessions: WorkoutSession[];
}

/** A session that stops a workout from being active (no exercise in it). */
export interface ActivationProblem {
  code: 'no_sessions' | 'empty_session';
  sessionLabel?: string;
  sessionName?: string;
}

export interface StudentWorkoutExercise {
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  load: string | null;
  /** Already the effective link: the educator's, else the library's, else null. */
  videoUrl: string | null;
}

export interface StudentWorkoutSession {
  id: string;
  label: string;
  name: string;
  exercises: StudentWorkoutExercise[];
}

export interface StudentEducatorWorkout {
  educator: { id: string; name: string };
  workout: {
    id: string;
    title: string;
    weeklyFrequency: number | null;
    updatedAt: string;
    sessions: StudentWorkoutSession[];
  };
}
