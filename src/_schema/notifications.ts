import { z } from 'zod';

export const notificationCategorySchema = z.enum([
  'WORKOUT_REMINDER',
  'CONSULTATION_REMINDER',
  'MESSAGES',
  'BILLING',
  'PRODUCT_NEWS',
]);

export const markReadSchema = z.object({
  notificationId: z.uuid(),
});

export const setPreferenceSchema = z.object({
  category: notificationCategorySchema,
  enabled: z.boolean(),
});
