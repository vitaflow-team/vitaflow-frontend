import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/notifications/markRead', () => ({
  actionMarkRead: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));

import { NotificationsPopoverContent } from './notificationsPopoverContent';

// PopoverContent renders through a Radix Portal, which renderToStaticMarkup
// never includes — its content is covered separately by
// notificationsList.test.tsx. This file only covers what's actually in the
// server-rendered tree: the trigger button and its unread badge.
describe('NotificationsPopoverContent — trigger badge', () => {
  it('renders the notifications trigger with its accessible attributes', () => {
    const markup = renderToStaticMarkup(
      <NotificationsPopoverContent notifications={[]} unreadCount={0} />
    );

    expect(markup).toContain('aria-label="Notificações"');
    expect(markup).toContain('aria-haspopup="dialog"');
  });

  it('shows the unread count badge only when there are unread notifications', () => {
    const withUnread = renderToStaticMarkup(
      <NotificationsPopoverContent notifications={[]} unreadCount={3} />
    );
    expect(withUnread).toContain('>3<');

    const withoutUnread = renderToStaticMarkup(
      <NotificationsPopoverContent notifications={[]} unreadCount={0} />
    );
    expect(withoutUnread).not.toContain('bg-destructive');
  });

  it('caps the badge display at 9+', () => {
    const markup = renderToStaticMarkup(
      <NotificationsPopoverContent notifications={[]} unreadCount={15} />
    );

    expect(markup).toContain('9+');
  });
});
