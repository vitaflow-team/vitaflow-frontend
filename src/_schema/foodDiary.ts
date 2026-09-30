import { z } from 'zod';

const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const;

export const estimateCaloriesSchema = z.object({
  description: z.string().min(1, 'Descreva a refeição.'),
});
export type estimateCaloriesFormData = z.infer<typeof estimateCaloriesSchema>;

export const logMealSchema = z.object({
  mealType: z.enum(MEAL_TYPES),
  description: z.string().min(1, 'Descreva a refeição.'),
  calories: z.coerce.number().int().min(1, 'Informe as calorias.'),
});
export type logMealFormData = z.infer<typeof logMealSchema>;

export const updateMealSchema = z.object({
  mealId: z.uuid(),
  mealType: z.enum(MEAL_TYPES).optional(),
  description: z.string().min(1).optional(),
  calories: z.coerce.number().int().min(1).optional(),
});
export type updateMealFormData = z.infer<typeof updateMealSchema>;

export const completeProfileSchema = z.object({
  sex: z.enum(['MALE', 'FEMALE']).optional(),
  goal: z
    .enum(['WEIGHT_LOSS', 'MUSCLE_GAIN', 'CONDITIONING', 'MAINTENANCE'])
    .optional(),
  weightKg: z.coerce.number().min(20).max(300).optional(),
  heightCm: z.coerce.number().min(50).max(250).optional(),
});
export type completeProfileFormData = z.infer<typeof completeProfileSchema>;
