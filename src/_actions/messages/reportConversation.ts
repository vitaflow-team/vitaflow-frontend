'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { conversationIdSchema } from '@/_schema/messages';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { CONVERSATION_NOT_FOUND, MESSAGES_ERRORS } from './messagesErrors';

/** US-005: report a conversation for backoffice review — quiet by design,
 * no notification is ever sent to the reported party. */
export const actionReportConversation = createServerAction()
  .input(conversationIdSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const conversationId = parseBackendId(input.id);

    try {
      await apiClient(`/conversations/${conversationId}/report`, {
        method: 'POST',
      });
    } catch (error) {
      throw toSafeActionError('reportConversation', error, [
        CONVERSATION_NOT_FOUND,
        ...MESSAGES_ERRORS,
      ]);
    }
  });
