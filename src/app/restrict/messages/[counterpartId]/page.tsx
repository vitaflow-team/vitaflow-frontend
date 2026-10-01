import { MessageThread } from '@/_components/messages/messageThread';
import { ReportConversationButton } from '@/_components/messages/reportConversationButton';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import {
  isLoadFailure,
  loadConversations,
  loadEligibleCounterparts,
  loadMessages,
} from '@/_lib/messagesData';
import { auth } from '@/auth';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';

export const metadata: Metadata = {
  title: PAGE_TITLES.messageThread,
};

const PROFESSIONAL_TYPES = ['NUTRITIONIST', 'PHYSICAL_EDUCATOR'];
const uuidSchema = z.uuid();

interface MessageThreadPageProps {
  params: Promise<{ counterpartId: string }>;
}

/**
 * Keyed by the counterpart's own user id, not a conversation id: the send
 * route itself is counterpart-id-centric (`POST /conversations/:counterpartId
 * /messages`), and this lets one route serve both a real conversation and an
 * eligible relationship that never had one yet (US-003.EC-1).
 */
export default async function MessageThreadPage({
  params,
}: MessageThreadPageProps) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { counterpartId } = await params;
  if (!uuidSchema.safeParse(counterpartId).success) notFound();

  const isProfessional = PROFESSIONAL_TYPES.includes(
    session.user.productType ?? ''
  );

  const [conversations, eligible] = await Promise.all([
    loadConversations(),
    loadEligibleCounterparts(isProfessional),
  ]);

  const conversationList = isLoadFailure(conversations) ? [] : conversations;
  const eligibleList = isLoadFailure(eligible) ? [] : eligible;

  const existing = conversationList.find(
    conversation => conversation.counterpart.id === counterpartId
  );
  const eligibleMatch = eligibleList.find(
    counterpart => counterpart.id === counterpartId
  );

  if (!existing && !eligibleMatch) notFound();

  const counterpartName = existing?.counterpart.name ?? eligibleMatch!.name;

  const initialMessages = existing ? await loadMessages(existing.id) : [];

  return (
    <DefaultLayout>
      <div className="flex h-[calc(100dvh-10rem)] flex-col gap-4">
        <div className="flex items-center justify-between gap-2 border-b border-primary pb-3">
          <div className="flex flex-col gap-1">
            <Link
              href="/restrict/messages"
              className="text-primary w-fit text-sm underline-offset-4 hover:underline"
            >
              ← Voltar para mensagens
            </Link>
            <h1 className="text-2xl font-semibold">{counterpartName}</h1>
          </div>
          {existing && (
            <ReportConversationButton
              conversationId={existing.id}
              counterpartName={counterpartName}
            />
          )}
        </div>

        <MessageThread
          viewerId={session.user.id}
          counterpartId={counterpartId}
          counterpartName={counterpartName}
          conversationId={existing?.id ?? null}
          initialMessages={
            isLoadFailure(initialMessages) ? [] : initialMessages
          }
        />
      </div>
    </DefaultLayout>
  );
}
