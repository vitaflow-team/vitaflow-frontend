import { describe, expect, it } from 'vitest';
import {
  completeProfileSchema,
  estimateCaloriesSchema,
  logMealSchema,
  updateMealSchema,
} from './foodDiary';

describe('estimateCaloriesSchema', () => {
  it('rejects an empty description', () => {
    expect(estimateCaloriesSchema.safeParse({ description: '' }).success).toBe(
      false
    );
  });

  it('accepts a vague description (US-001.EC-1)', () => {
    expect(
      estimateCaloriesSchema.safeParse({ description: 'comida' }).success
    ).toBe(true);
  });
});

describe('logMealSchema', () => {
  const valid = {
    mealType: 'LUNCH',
    description: 'Arroz e feijão',
    calories: 500,
  };

  it('accepts a valid meal', () => {
    expect(logMealSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a blank description', () => {
    expect(logMealSchema.safeParse({ ...valid, description: '' }).success).toBe(
      false
    );
  });

  it('rejects a non-positive calorie value', () => {
    expect(logMealSchema.safeParse({ ...valid, calories: 0 }).success).toBe(
      false
    );
    expect(logMealSchema.safeParse({ ...valid, calories: -10 }).success).toBe(
      false
    );
  });

  it('rejects an invalid meal type', () => {
    expect(
      logMealSchema.safeParse({ ...valid, mealType: 'BRUNCH' }).success
    ).toBe(false);
  });
});

describe('updateMealSchema', () => {
  const ID = '0190aaaa-bbbb-7ccc-8ddd-eeeeffff0000';

  it('accepts a partial update', () => {
    expect(
      updateMealSchema.safeParse({ mealId: ID, calories: 600 }).success
    ).toBe(true);
  });

  it('requires mealId to be a UUID', () => {
    expect(
      updateMealSchema.safeParse({ mealId: 'not-a-uuid', calories: 600 })
        .success
    ).toBe(false);
  });
});

describe('completeProfileSchema', () => {
  it('accepts an empty submission (all fields optional)', () => {
    expect(completeProfileSchema.safeParse({}).success).toBe(true);
  });

  it('accepts a full submission', () => {
    expect(
      completeProfileSchema.safeParse({
        sex: 'MALE',
        goal: 'MAINTENANCE',
        weightKg: 80,
        heightCm: 180,
      }).success
    ).toBe(true);
  });

  it('rejects an out-of-range weight', () => {
    expect(completeProfileSchema.safeParse({ weightKg: 5 }).success).toBe(
      false
    );
  });
});
