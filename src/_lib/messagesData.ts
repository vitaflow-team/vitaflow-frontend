import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import {
  hasLinkedProfessional,
  isLoadFailure as isMirrorLoadFailure,
  loadEducatorMirror,
  loadNutritionistMirror,
} from '@/_lib/professionalMirrorData';
import type { LoadFailure } from '@/_types/loadFailure';
import type {
  ConversationSummary,
  EligibleCounterpart,
  Message,
} from '@/_types/messages';
import { unstable_rethrow } from 'next/navigation';

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  console.error(`Messages: ${source} failed.`, { status });
  return 'failed';
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}

export async function loadConversations(): Promise<
  ConversationSummary[] | LoadFailure
> {
  try {
    return await apiClient<ConversationSummary[]>('/conversations', {
      method: 'GET',
      cache: 'no-store',
    });
  } catch (error) {
    return toFailure(error, 'list');
  }
}

export async function loadMessages(
  conversationId: string,
  after?: string
): Promise<Message[] | LoadFailure> {
  const query = after ? `?after=${encodeURIComponent(after)}` : '';
  try {
    return await apiClient<Message[]>(
      `/conversations/${conversationId}/messages${query}`,
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    return toFailure(error, 'messages');
  }
}

interface EligibilityClient {
  id: string;
  name: string;
  userId: string | null;
}

async function loadEligibleClients(): Promise<
  EligibilityClient[] | LoadFailure
> {
  try {
    return await apiClient<EligibilityClient[]>('/clients', {
      method: 'GET',
      cache: 'no-store',
    });
  } catch (error) {
    return toFailure(error, 'clients');
  }
}

/**
 * Who the caller may message (US-007): for a professional, their clients
 * with a real linked account; for a user, the nutritionist and/or physical
 * educator mirrored on their own account. Reads only `ClientsRepository`
 * data either way — the same single source of truth Task 1's eligibility
 * check uses (TechSpec § Integration Points).
 */
export async function loadEligibleCounterparts(
  isProfessional: boolean
): Promise<EligibleCounterpart[] | LoadFailure> {
  if (isProfessional) {
    const clients = await loadEligibleClients();
    if (isLoadFailure(clients)) return clients;
    return clients
      .filter(
        (client): client is EligibilityClient & { userId: string } =>
          client.userId !== null
      )
      .map(client => ({ id: client.userId, name: client.name }));
  }

  const [nutritionist, educator] = await Promise.all([
    loadNutritionistMirror(),
    loadEducatorMirror(),
  ]);

  const eligible: EligibleCounterpart[] = [];
  if (
    !isMirrorLoadFailure(nutritionist) &&
    hasLinkedProfessional(nutritionist)
  ) {
    eligible.push({
      id: nutritionist.professional.id,
      name: nutritionist.professional.name,
    });
  }
  if (!isMirrorLoadFailure(educator) && hasLinkedProfessional(educator)) {
    eligible.push({
      id: educator.professional.id,
      name: educator.professional.name,
    });
  }
  return eligible;
}
