import type { NotificationCategory } from '@/_types/notifications';

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  'WORKOUT_REMINDER',
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
  CONSULTATION_REMINDER: 'Lembrete de consulta',
  MESSAGES: 'Mensagens',
  BILLING: 'Cobranças',
  PRODUCT_NEWS: 'Novidades Vita Flow',
};
