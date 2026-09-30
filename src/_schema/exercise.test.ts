import { describe, expect, it } from 'vitest';
import { updateWorkoutExerciseSchema } from './exercise';

const ID = '0190aaaa-bbbb-7ccc-8ddd-eeeeffff0000';

describe('updateWorkoutExerciseSchema', () => {
  it('accepts a sets/reps edit', () => {
    const result = updateWorkoutExerciseSchema.safeParse({
      workoutExerciseId: ID,
      sets: 4,
      reps: 10,
    });
    expect(result.success).toBe(true);
  });

  it('accepts an exercise swap', () => {
    const result = updateWorkoutExerciseSchema.safeParse({
      workoutExerciseId: ID,
      exerciseId: ID,
    });
    expect(result.success).toBe(true);
  });

  it('accepts a removal', () => {
    const result = updateWorkoutExerciseSchema.safeParse({
      workoutExerciseId: ID,
      remove: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects a non-positive sets value', () => {
    const result = updateWorkoutExerciseSchema.safeParse({
      workoutExerciseId: ID,
      sets: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rejects a reps value above the sane range', () => {
    const result = updateWorkoutExerciseSchema.safeParse({
      workoutExerciseId: ID,
      reps: 500,
    });
    expect(result.success).toBe(false);
  });

  it('requires workoutExerciseId to be a UUID', () => {
    const result = updateWorkoutExerciseSchema.safeParse({
      workoutExerciseId: 'not-a-uuid',
    });
    expect(result.success).toBe(false);
  });
});
