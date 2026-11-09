import { z } from 'zod';

export const notificationCategorySchema = z.enum([
  'WORKOUT_REMINDER',
  'WORKOUT_PLAN',
  'SCHEDULE_CHANGE',
  'CONSULTATION_REMINDER',
  'MESSAGES',
  'BILLING',
  'PRODUCT_NEWS',
  'CHURN_RISK_ALERT',
]);

export const markReadSchema = z.object({
  notificationId: z.uuid(),
});

export const setPreferenceSchema = z.object({
  category: notificationCategorySchema,
  enabled: z.boolean(),
});
