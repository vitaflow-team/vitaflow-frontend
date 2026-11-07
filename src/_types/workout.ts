export type FitnessGoal =
  | 'WEIGHT_LOSS'
  | 'MUSCLE_GAIN'
  | 'CONDITIONING'
  | 'MAINTENANCE';

export interface WorkoutExercise {
  id: string;
  exercise: {
    id: string;
    name: string;
    muscleGroup: string;
    videoUrl: string | null;
  } | null;
  sets: number;
  reps: number;
  order: number;
}

export interface WorkoutDay {
  id: string;
  dayOfWeek: number;
  exercises: WorkoutExercise[];
}

export interface Workout {
  id: string;
  goal: FitnessGoal;
  daysPerWeek: number;
  explanation: string;
  days: WorkoutDay[];
}

export interface ConversationTurn {
  conversationId: string;
  field: string | null;
  question: string;
  done: boolean;
  reprompt: boolean;
  /** True only for the restrictionDetail turn — the UI offers a "Pular"
   * affordance only then; every other field stays mandatory. */
  optional: boolean;
}

/** `POST /workouts/conversation` returns the next question, or, on the
 * turn that completes the conversation, the freshly generated workout. */
export type ConversationOrWorkout = ConversationTurn | Workout;

/** Parameter typed against the generic `ConversationTurnLike` (not the
 * workout-specific `ConversationTurn`) so this guard satisfies the
 * generalized `ConversationChat`'s `isReady` prop shape (ADR-009) — a
 * `ConversationTurn` value still satisfies `ConversationTurnLike`
 * structurally (it just carries the extra `field`/`done` fields too). */
export function isGeneratedWorkout(
  result: { conversationId: string; question: string } | Workout
): result is Workout {
  return 'days' in result;
}
