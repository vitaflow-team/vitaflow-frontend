'use client';

import { actionMarkRead } from '@/_actions/notifications/markRead';
import { Button } from '@/_components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/_components/ui/popover';
import type { Notification } from '@/_types/notifications';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useServerAction } from 'zsa-react';
import { NotificationsList } from './notificationsList';

interface NotificationsPopoverContentProps {
  notifications: Notification[];
  unreadCount: number;
}

// Mark-as-read happens on *viewing* the center (US-002), not a separate
// explicit action — opening the popover is the view. Guarded by a ref so a
// re-open within the same page load doesn't repeat the calls once the
// server has already re-rendered with readAt set.
export function NotificationsPopoverContent({
  notifications,
  unreadCount,
}: NotificationsPopoverContentProps) {
  const router = useRouter();
  const { execute } = useServerAction(actionMarkRead);
  const hasMarkedRef = useRef(false);

  async function handleOpenChange(open: boolean): Promise<void> {
    if (!open || hasMarkedRef.current) return;
    const unread = notifications.filter(n => !n.readAt);
    if (unread.length === 0) return;

    hasMarkedRef.current = true;
    await Promise.all(unread.map(n => execute({ notificationId: n.id })));
    router.refresh();
  }

  return (
    <Popover onOpenChange={open => void handleOpenChange(open)}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notificações"
          className="relative"
        >
          <Bell aria-hidden="true" />
          {unreadCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        collisionPadding={8}
        className="w-72 max-w-[calc(100vw-1rem)]"
      >
        <NotificationsList notifications={notifications} />
      </PopoverContent>
    </Popover>
  );
}
