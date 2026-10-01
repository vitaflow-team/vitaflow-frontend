import type { ConversationListItem as ConversationListItemType } from '@/_types/messages';
import Link from 'next/link';
import { ConversationListItem } from './conversationListItem';

interface ConversationListProps {
  items: ConversationListItemType[];
}

/** US-007.AC-1: an explicit empty state when there is no eligible
 * relationship at all, distinct from US-007.AC-2's invite-to-start rows. */
export function ConversationList({ items }: ConversationListProps) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-[20rem] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line bg-card px-6 py-12 text-center">
        <p className="text-muted-foreground max-w-sm">
          Você ainda não tem nenhum vínculo elegível para troca de mensagens.
        </p>
        <Link
          href="/restrict/professionals"
          className="text-primary text-sm underline-offset-4 hover:underline"
        >
          Buscar um profissional
        </Link>
      </div>
    );
  }

  return (
    <ul aria-label="Conversas" className="flex flex-col gap-2">
      {items.map(item => (
        <ConversationListItem key={item.counterpartId} item={item} />
      ))}
    </ul>
  );
}
