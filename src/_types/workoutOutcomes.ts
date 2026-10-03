import type { ActivationProblem, WorkoutTree } from '@/_types/educatorWorkouts';

/** What saving the whole workout reports; other failures are thrown as safe errors. */
export type SaveWorkoutOutcome =
  | { outcome: 'saved'; workout: WorkoutTree }
  /** The active workout would have become invalid (422). */
  | { outcome: 'active_invalid' }
  /** The student or the workout is gone. */
  | { outcome: 'not_found' };

export type ActivateWorkoutOutcome =
  | { outcome: 'activated'; workout: WorkoutTree }
  /** A session has no exercise (422); `problems` names them. */
  | { outcome: 'not_activatable'; problems: ActivationProblem[] }
  | { outcome: 'not_found' };
