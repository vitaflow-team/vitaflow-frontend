import { ConversationList } from '@/_components/messages/conversationList';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import {
  isLoadFailure,
  loadConversations,
  loadEligibleCounterparts,
} from '@/_lib/messagesData';
import { mergeConversationsWithEligible } from '@/_lib/messagesList';
import { auth } from '@/auth';
import type { Metadata } from 'next';
import { LoadFailureNotice } from './loadFailureNotice';

export const metadata: Metadata = {
  title: PAGE_TITLES.messages,
};

const PROFESSIONAL_TYPES = ['NUTRITIONIST', 'PHYSICAL_EDUCATOR'];

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const isProfessional = PROFESSIONAL_TYPES.includes(
    session.user.productType ?? ''
  );

  const [conversations, eligible] = await Promise.all([
    loadConversations(),
    loadEligibleCounterparts(isProfessional),
  ]);

  if (isLoadFailure(conversations)) {
    return (
      <DefaultLayout>
        <LoadFailureNotice />
      </DefaultLayout>
    );
  }

  const items = mergeConversationsWithEligible(
    conversations,
    isLoadFailure(eligible) ? [] : eligible
  );

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <header className="border-b border-primary pb-3">
          <h1 className="text-2xl font-semibold">Mensagens</h1>
          <p className="text-sm text-muted-foreground">
            Converse com quem você tem um vínculo ativo.
          </p>
        </header>

        <ConversationList items={items} />
      </div>
    </DefaultLayout>
  );
}
