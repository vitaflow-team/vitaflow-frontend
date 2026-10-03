import type { NotificationCategory } from '@/_types/notifications';

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  'WORKOUT_REMINDER',
  'WORKOUT_PLAN',
  'SCHEDULE_CHANGE',
  'CONSULTATION_REMINDER',
  'MESSAGES',
  'BILLING',
  'PRODUCT_NEWS',
];

export const NOTIFICATION_CATEGORY_LABELS: Record<
  NotificationCategory,
  string
> = {
  WORKOUT_REMINDER: 'Lembrete de treino',
  WORKOUT_PLAN: 'Treino do seu educador',
  SCHEDULE_CHANGE: 'Horários com seu educador',
  CONSULTATION_REMINDER: 'Lembrete de consulta',
  MESSAGES: 'Mensagens',
  BILLING: 'Cobranças',
  PRODUCT_NEWS: 'Novidades Vita Flow',
};
