'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { pollMessagesSchema } from '@/_schema/messages';
import type { Message } from '@/_types/messages';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { CONVERSATION_NOT_FOUND, MESSAGES_ERRORS } from './messagesErrors';

/** US-003: poll for messages in an owned conversation, optionally only
 * those after a given message id (ADR-001 — polling, not a WebSocket). */
export const actionPollMessages = createServerAction()
  .input(pollMessagesSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const conversationId = parseBackendId(input.conversationId);
    const query = input.after
      ? `?after=${encodeURIComponent(input.after)}`
      : '';

    try {
      return await apiClient<Message[]>(
        `/conversations/${conversationId}/messages${query}`,
        { method: 'GET', cache: 'no-store' }
      );
    } catch (error) {
      throw toSafeActionError('pollMessages', error, [
        CONVERSATION_NOT_FOUND,
        ...MESSAGES_ERRORS,
      ]);
    }
  });
