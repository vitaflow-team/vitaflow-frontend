import { z } from 'zod';

/** Body for `PATCH /workouts/exercises/:workoutExerciseId`: swap the
 * exercise, adjust sets/reps, or remove it from its day. */
export const updateWorkoutExerciseSchema = z.object({
  workoutExerciseId: z.uuid(),
  exerciseId: z.uuid().optional(),
  sets: z.coerce.number().int().min(1).max(20).optional(),
  reps: z.coerce.number().int().min(1).max(100).optional(),
  remove: z.boolean().optional(),
});

export type updateWorkoutExerciseFormData = z.infer<
  typeof updateWorkoutExerciseSchema
>;
