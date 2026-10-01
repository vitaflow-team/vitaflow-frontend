import type { ConversationListItem } from '@/_types/messages';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ConversationList } from './conversationList';

function item(
  overrides: Partial<ConversationListItem> = {}
): ConversationListItem {
  return {
    counterpartId: 'counterpart-1',
    counterpartName: 'Dra. Ana',
    conversationId: 'conv-1',
    lastMessage: {
      content: 'Como você está?',
      senderId: 'counterpart-1',
      createdAt: '2026-10-01T10:00:00.000Z',
    },
    createdAt: '2026-10-01T09:00:00.000Z',
    ...overrides,
  };
}

describe('ConversationList', () => {
  // US-007.AC-1
  it('shows an explicit empty state with no eligible relationships, not a blank list', () => {
    const html = renderToStaticMarkup(<ConversationList items={[]} />);
    expect(html).toContain('nenhum vínculo elegível');
    expect(html).toContain('Buscar um profissional');
  });

  // US-003.AC-1
  it('lists a conversation with its last-message preview', () => {
    const html = renderToStaticMarkup(<ConversationList items={[item()]} />);
    expect(html).toContain('Dra. Ana');
    expect(html).toContain('Como você está?');
  });

  // US-007.AC-2
  it('invites the first message for an eligible relationship with no conversation yet', () => {
    const html = renderToStaticMarkup(
      <ConversationList
        items={[
          item({ conversationId: null, lastMessage: null, createdAt: null }),
        ]}
      />
    );
    expect(html).toContain('Nenhuma mensagem ainda');
    expect(html).toContain('/restrict/messages/counterpart-1');
  });
});
