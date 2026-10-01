import {
  isLoadFailure,
  loadNotifications,
  loadUnreadCount,
} from '@/_lib/notificationsData';
import { NotificationsPopoverContent } from './notificationsPopoverContent';

/**
 * Real data now (Notifications PRD) — replaces the former permanent empty
 * state (prior ADR-004). The empty-state copy itself is preserved
 * unconditionally for the genuinely-empty case, just rendered from real
 * data instead of hardcoded. The Radix popover primitives, inside
 * `NotificationsPopoverContent`, are the client boundary.
 */
export async function NotificationsBell() {
  const [notifications, unreadCount] = await Promise.all([
    loadNotifications(),
    loadUnreadCount(),
  ]);

  return (
    <NotificationsPopoverContent
      notifications={isLoadFailure(notifications) ? [] : notifications}
      unreadCount={isLoadFailure(unreadCount) ? 0 : unreadCount}
    />
  );
}
