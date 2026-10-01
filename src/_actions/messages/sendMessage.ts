'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { TOO_MANY_REQUESTS, toSafeActionError } from '@/_lib/safeActionError';
import { sendMessageSchema } from '@/_schema/messages';
import type { Message } from '@/_types/messages';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { MESSAGES_ERRORS, NOT_ELIGIBLE } from './messagesErrors';

/** US-002: send a message; the backend creates the conversation on first
 * send when the caller and counterpart have an active Client relationship. */
export const actionSendMessage = createServerAction()
  .input(sendMessageSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const counterpartId = parseBackendId(input.counterpartId);

    try {
      return await apiClient<Message>(
        `/conversations/${counterpartId}/messages`,
        {
          method: 'POST',
          body: JSON.stringify({ content: input.content }),
        }
      );
    } catch (error) {
      throw toSafeActionError('sendMessage', error, [
        NOT_ELIGIBLE,
        TOO_MANY_REQUESTS,
        ...MESSAGES_ERRORS,
      ]);
    }
  });
