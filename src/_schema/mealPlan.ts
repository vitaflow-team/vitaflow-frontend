import { z } from 'zod';

export const MEAL_LABEL_MAX_LENGTH = 100;
export const MEAL_TEXT_MAX_LENGTH = 1000;
export const MEALS_PER_DAY_MAX = 20;

const weekdaySchema = z.enum([
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
]);

const mealInputSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, 'O nome da refeição é obrigatório.')
    .max(
      MEAL_LABEL_MAX_LENGTH,
      `Máximo de ${MEAL_LABEL_MAX_LENGTH} caracteres.`
    ),
  text: z
    .string()
    .trim()
    .max(MEAL_TEXT_MAX_LENGTH, `Máximo de ${MEAL_TEXT_MAX_LENGTH} caracteres.`),
});

export const saveDaySchema = z.object({
  clientId: z.uuid(),
  weekday: weekdaySchema,
  meals: z.array(mealInputSchema).max(MEALS_PER_DAY_MAX),
});

export const cloneDaySchema = z.object({
  clientId: z.uuid(),
  weekday: weekdaySchema,
  sourceDayId: z.uuid(),
  confirmOverwrite: z.boolean().optional(),
});

export const publishMealPlanSchema = z.object({
  clientId: z.uuid(),
});

/** Body for `POST .../meal-plan/generation/conversation`: `clientId`
 * always; empty (besides `clientId`) to start, otherwise the free-text
 * reply to the previous question — mirroring `conversationAnswerSchema`
 * (`_schema/workout.tsx`). `confirmOverwrite` is read only on the start
 * call (no `conversationId`), per ADR-013. */
export const mealPlanConversationSchema = z.object({
  clientId: z.string(),
  conversationId: z.uuid().optional(),
  answer: z.string().optional(),
  confirmOverwrite: z.boolean().optional(),
});

export type MealInputData = z.infer<typeof mealInputSchema>;
