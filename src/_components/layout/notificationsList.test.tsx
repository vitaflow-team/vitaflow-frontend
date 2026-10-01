import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { Notification } from '@/_types/notifications';
import { NotificationsList } from './notificationsList';

const NOTIFICATIONS: Notification[] = [
  {
    id: 'a',
    category: 'BILLING',
    message: 'Seu pagamento falhou.',
    link: null,
    readAt: null,
    createdAt: '2026-09-30T12:00:00.000Z',
  },
  {
    id: 'b',
    category: 'MESSAGES',
    message: 'Nova mensagem recebida.',
    link: null,
    readAt: '2026-09-29T12:00:00.000Z',
    createdAt: '2026-09-29T10:00:00.000Z',
  },
];

describe('NotificationsList', () => {
  it('preserves the exact empty-state copy when there are no notifications', () => {
    const markup = renderToStaticMarkup(
      <NotificationsList notifications={[]} />
    );

    expect(markup).toContain('Você não tem notificações.');
  });

  it('shows the category, message, and timestamp for each notification, newest-first as given', () => {
    const markup = renderToStaticMarkup(
      <NotificationsList notifications={NOTIFICATIONS} />
    );

    expect(markup).toContain('Cobranças');
    expect(markup).toContain('Seu pagamento falhou.');
    expect(markup).toContain('Mensagens');
    expect(markup).toContain('Nova mensagem recebida.');
  });

  it('marks an unread notification visually distinct from a read one', () => {
    const markup = renderToStaticMarkup(
      <NotificationsList notifications={NOTIFICATIONS} />
    );

    const unreadIndex = markup.indexOf('Seu pagamento falhou.');
    const readIndex = markup.indexOf('Nova mensagem recebida.');
    const unreadLi = markup.lastIndexOf('<li', unreadIndex);
    const readLi = markup.lastIndexOf('<li', readIndex);

    expect(markup.slice(unreadLi, unreadIndex)).toContain('font-medium');
    expect(markup.slice(readLi, readIndex)).not.toContain('font-medium');
  });
});
