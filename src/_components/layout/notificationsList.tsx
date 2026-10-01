import { NOTIFICATION_CATEGORY_LABELS } from '@/_lib/notificationCategoryLabels';
import { cn } from '@/_lib/utils';
import type { Notification } from '@/_types/notifications';

interface NotificationsListProps {
  notifications: Notification[];
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Pure display, no Popover/Portal wrapper — kept separate so it can be
// rendered (and tested) outside the portaled PopoverContent, which
// renderToStaticMarkup never includes in its output.
export function NotificationsList({ notifications }: NotificationsListProps) {
  return (
    <>
      <p className="text-sm font-semibold">Notificações</p>
      {notifications.length === 0 ? (
        <p className="mt-1 text-sm text-muted-foreground">
          Você não tem notificações.
        </p>
      ) : (
        <ul className="mt-2 flex max-h-80 flex-col gap-3 overflow-y-auto">
          {notifications.map(notification => (
            <li
              key={notification.id}
              className={cn(
                'border-b border-line pb-2 last:border-0 last:pb-0',
                !notification.readAt && 'font-medium'
              )}
            >
              <p className="text-xs text-muted-foreground">
                {NOTIFICATION_CATEGORY_LABELS[notification.category]}
              </p>
              <p className="text-sm">{notification.message}</p>
              <p className="text-xs text-muted-foreground">
                {formatTimestamp(notification.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
