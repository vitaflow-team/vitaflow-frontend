import type {
  ConversationSummary,
  EligibleCounterpart,
} from '@/_types/messages';
import { describe, expect, it } from 'vitest';
import { mergeConversationsWithEligible } from './messagesList';

function conversation(
  overrides: Partial<ConversationSummary> = {}
): ConversationSummary {
  return {
    id: 'conv-1',
    counterpart: { id: 'counterpart-1', name: 'Dra. Ana' },
    lastMessage: {
      content: 'Oi!',
      senderId: 'counterpart-1',
      createdAt: '2026-10-01T10:00:00.000Z',
    },
    createdAt: '2026-10-01T09:00:00.000Z',
    ...overrides,
  };
}

function counterpart(
  overrides: Partial<EligibleCounterpart> = {}
): EligibleCounterpart {
  return { id: 'counterpart-2', name: 'João', ...overrides };
}

describe('mergeConversationsWithEligible', () => {
  // US-007.AC-2
  it('appends an eligible relationship with no conversation yet, with no conversationId and no lastMessage', () => {
    const result = mergeConversationsWithEligible([], [counterpart()]);

    expect(result).toEqual([
      {
        counterpartId: 'counterpart-2',
        counterpartName: 'João',
        conversationId: null,
        lastMessage: null,
        createdAt: null,
      },
    ]);
  });

  it('lists a real conversation with its last-message preview', () => {
    const result = mergeConversationsWithEligible([conversation()], []);

    expect(result).toEqual([
      {
        counterpartId: 'counterpart-1',
        counterpartName: 'Dra. Ana',
        conversationId: 'conv-1',
        lastMessage: conversation().lastMessage,
        createdAt: '2026-10-01T09:00:00.000Z',
      },
    ]);
  });

  // An eligible counterpart that already has a conversation is not duplicated.
  it('does not duplicate an eligible counterpart that already has a conversation', () => {
    const result = mergeConversationsWithEligible(
      [conversation({ counterpart: { id: 'counterpart-2', name: 'João' } })],
      [counterpart()]
    );

    expect(result).toHaveLength(1);
    expect(result[0].conversationId).toBe('conv-1');
  });

  // US-007.AC-1 (via the caller: an empty result from this merge is what
  // drives the "no eligible relationships at all" empty state).
  it('returns an empty list when there are neither conversations nor eligible relationships', () => {
    expect(mergeConversationsWithEligible([], [])).toEqual([]);
  });

  it('keeps conversations ordered first, eligible-without-conversation after', () => {
    const result = mergeConversationsWithEligible(
      [conversation()],
      [counterpart()]
    );

    expect(result.map(item => item.counterpartId)).toEqual([
      'counterpart-1',
      'counterpart-2',
    ]);
  });
});
