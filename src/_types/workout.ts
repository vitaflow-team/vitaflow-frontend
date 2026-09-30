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
}

/** `POST /workouts/conversation` returns the next question, or, on the
 * turn that completes the conversation, the freshly generated workout. */
export type ConversationOrWorkout = ConversationTurn | Workout;

export function isGeneratedWorkout(
  result: ConversationOrWorkout
): result is Workout {
  return 'days' in result;
}
