import type { ConversationListItem as ConversationListItemType } from '@/_types/messages';
import Link from 'next/link';

interface ConversationListItemProps {
  item: ConversationListItemType;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** One row of the conversation list — a real conversation with its last
 * message, or an eligible relationship with none yet (US-007.AC-2). */
export function ConversationListItem({ item }: ConversationListItemProps) {
  return (
    <li>
      <Link
        href={`/restrict/messages/${item.counterpartId}`}
        className="bg-card flex flex-col gap-1 rounded-lg border p-4 transition-colors hover:bg-secondary/50"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold break-words">
            {item.counterpartName}
          </span>
          {item.lastMessage && (
            <span className="text-muted-foreground shrink-0 text-xs">
              {formatTime(item.lastMessage.createdAt)}
            </span>
          )}
        </div>
        <p className="text-muted-foreground truncate text-sm">
          {item.lastMessage
            ? item.lastMessage.content
            : 'Nenhuma mensagem ainda — envie a primeira.'}
        </p>
      </Link>
    </li>
  );
}
