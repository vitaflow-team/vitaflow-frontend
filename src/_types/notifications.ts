export type NotificationCategory =
  | 'WORKOUT_REMINDER'
  | 'CONSULTATION_REMINDER'
  | 'MESSAGES'
  | 'BILLING'
  | 'PRODUCT_NEWS';

export interface Notification {
  id: string;
  category: NotificationCategory;
  message: string;
  link: string | null;
  readAt: string | null;
  createdAt: string;
}

export type NotificationPreferences = Record<NotificationCategory, boolean>;
