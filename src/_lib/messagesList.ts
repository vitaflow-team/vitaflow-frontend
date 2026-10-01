import type {
  ConversationListItem,
  ConversationSummary,
  EligibleCounterpart,
} from '@/_types/messages';

/**
 * Real conversations first, then eligible relationships that have none yet
 * (US-007.AC-2) — never hidden until a first message exists. An eligible
 * counterpart already covered by a real conversation is not duplicated.
 */
export function mergeConversationsWithEligible(
  conversations: ConversationSummary[],
  eligible: EligibleCounterpart[]
): ConversationListItem[] {
  const fromConversations: ConversationListItem[] = conversations.map(
    conversation => ({
      counterpartId: conversation.counterpart.id,
      counterpartName: conversation.counterpart.name,
      conversationId: conversation.id,
      lastMessage: conversation.lastMessage,
      createdAt: conversation.createdAt,
    })
  );

  const knownIds = new Set(fromConversations.map(item => item.counterpartId));

  const fromEligible: ConversationListItem[] = eligible
    .filter(counterpart => !knownIds.has(counterpart.id))
    .map(counterpart => ({
      counterpartId: counterpart.id,
      counterpartName: counterpart.name,
      conversationId: null,
      lastMessage: null,
      createdAt: null,
    }));

  return [...fromConversations, ...fromEligible];
}
