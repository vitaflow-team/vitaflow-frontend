import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import type { LoadFailure } from '@/_types/loadFailure';
import type {
  Notification,
  NotificationPreferences,
} from '@/_types/notifications';
import { unstable_rethrow } from 'next/navigation';

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  console.error(`Notifications: ${source} failed.`, { status });
  return 'failed';
}

export async function loadNotifications(): Promise<
  Notification[] | LoadFailure
> {
  try {
    return await apiClient<Notification[]>('/notifications', {
      method: 'GET',
      cache: 'no-store',
    });
  } catch (error) {
    return toFailure(error, 'list');
  }
}

export async function loadUnreadCount(): Promise<number | LoadFailure> {
  try {
    const result = await apiClient<{ count: number }>(
      '/notifications/unread-count',
      { method: 'GET', cache: 'no-store' }
    );
    return result.count;
  } catch (error) {
    return toFailure(error, 'unread-count');
  }
}

export async function loadPreferences(): Promise<
  NotificationPreferences | LoadFailure
> {
  try {
    return await apiClient<NotificationPreferences>(
      '/notifications/preferences',
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    return toFailure(error, 'preferences');
  }
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}
