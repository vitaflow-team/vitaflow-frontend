export interface MessageCounterpart {
  id: string;
  name: string;
}

export interface LastMessagePreview {
  content: string;
  senderId: string;
  createdAt: string;
}

export interface ConversationSummary {
  id: string;
  counterpart: MessageCounterpart;
  lastMessage: LastMessagePreview | null;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface EligibleCounterpart {
  id: string;
  name: string;
}

/** One row of the merged conversation list — a real conversation, or an
 * eligible relationship that has none yet (US-007.AC-2). */
export interface ConversationListItem {
  counterpartId: string;
  counterpartName: string;
  conversationId: string | null;
  lastMessage: LastMessagePreview | null;
  createdAt: string | null;
}
