import { freeExerciseFormSchema } from '@/_schema/educatorWorkouts';
import type { ExerciseEquipment } from '@/_types/exerciseEquipment';

export interface FreeExerciseValues {
  name: string;
  muscleGroup: string;
  equipment: ExerciseEquipment | null;
}

export type FreeExerciseParse =
  | { ok: true; values: FreeExerciseValues }
  | { ok: false; errors: Record<string, string> };

/** Reads the add-by-name form: field messages keyed by field, or the clean values. */
export function parseFreeExercise(input: {
  name: string;
  muscleGroup: string;
  equipment: string;
}): FreeExerciseParse {
  const parsed = freeExerciseFormSchema.safeParse({
    ...input,
    equipment: input.equipment === '' ? null : input.equipment,
  });
  if (parsed.success) return { ok: true, values: parsed.data };

  const errors = Object.fromEntries(
    parsed.error.issues.map(issue => [String(issue.path[0]), issue.message])
  );
  return { ok: false, errors };
}
