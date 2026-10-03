import type { ExerciseContraindication } from '@/_types/exerciseContraindication';
import type { ExerciseEquipment } from '@/_types/exerciseEquipment';
import type { ExerciseSource } from '@/_types/educatorWorkouts';

/** One exercise of the working copy: every number is text while it is typed. */
export interface EditorExercise {
  /** Stable key for the list, never sent to the server. */
  key: string;
  /** The saved id; absent for an exercise added in this editing session. */
  id?: string;
  source: ExerciseSource;
  exerciseId: string | null;
  name: string;
  muscleGroup: string;
  equipment: ExerciseEquipment | null;
  sets: string;
  reps: string;
  load: string;
  videoUrl: string;
  libraryVideoUrl: string | null;
  conflicts: ExerciseContraindication[];
}

export interface EditorSession {
  key: string;
  id?: string;
  name: string;
  exercises: EditorExercise[];
}

/** The working copy of a workout, held by the editor until it is saved. */
export interface WorkoutEditorState {
  title: string;
  weeklyFrequency: string;
  sessions: EditorSession[];
}
