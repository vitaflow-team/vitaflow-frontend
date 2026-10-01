'use client';

import { actionPollMessages } from '@/_actions/messages/pollMessages';
import { actionSendMessage } from '@/_actions/messages/sendMessage';
import { Button } from '@/_components/ui/button';
import { Textarea } from '@/_components/ui/textarea';
import type { Message } from '@/_types/messages';
import { useEffect, useRef, useState } from 'react';
import { useServerAction } from 'zsa-react';

interface MessageThreadProps {
  viewerId: string;
  counterpartId: string;
  counterpartName: string;
  conversationId: string | null;
  initialMessages: Message[];
}

// ADR-001 leaves the exact interval to the TechSpec, which in turn leaves it
// to the implementer ("a few seconds" — task_03.md requirement). Chosen
// value: frequent enough to feel live while a thread is open, without
// hammering the backend's rate limit on an unrelated route.
const POLL_INTERVAL_MS = 4000;

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function mergeNewMessages(current: Message[], incoming: Message[]): Message[] {
  const knownIds = new Set(current.map(message => message.id));
  const unseen = incoming.filter(message => !knownIds.has(message.id));
  return unseen.length === 0 ? current : [...current, ...unseen];
}

/** US-002/US-003: the open thread — full history on load (EC-1: an empty
 * conversation invites the first message), new messages arrive by polling
 * while the thread stays open (ADR-001). */
export function MessageThread({
  viewerId,
  counterpartId,
  counterpartName,
  conversationId: initialConversationId,
  initialMessages,
}: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [content, setContent] = useState('');
  const [sendError, setSendError] = useState<string>();
  const { isPending, execute } = useServerAction(actionSendMessage);
  const bottomRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef(conversationId);
  const lastMessageIdRef = useRef<string | undefined>(messages.at(-1)?.id);

  useEffect(() => {
    conversationIdRef.current = conversationId;
    lastMessageIdRef.current = messages.at(-1)?.id;
  }, [conversationId, messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const activeConversationId = conversationIdRef.current;
      if (!activeConversationId) return;

      const [result] = await actionPollMessages({
        conversationId: activeConversationId,
        after: lastMessageIdRef.current,
      });
      if (result && result.length > 0) {
        setMessages(current => mergeNewMessages(current, result));
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    setSendError(undefined);
    const [result, error] = await execute({ counterpartId, content: trimmed });
    if (error) {
      setSendError(error.message);
      return;
    }
    if (!result) return;

    setConversationId(result.conversationId);
    setMessages(current => mergeNewMessages(current, [result]));
    setContent('');
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-lg border p-4">
        {messages.length === 0 && (
          // US-003.EC-1: an empty conversation state, not a broken view.
          <p className="text-muted-foreground m-auto text-center text-sm">
            Nenhuma mensagem ainda. Envie a primeira para {counterpartName}.
          </p>
        )}
        {messages.map(message => {
          const isMine = message.senderId === viewerId;
          return (
            <div
              key={message.id}
              className={`flex flex-col gap-1 ${isMine ? 'items-end' : 'items-start'}`}
            >
              <p
                className={`w-fit max-w-[80%] rounded-lg px-4 py-2 break-words whitespace-pre-wrap ${
                  isMine ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                }`}
              >
                {message.content}
              </p>
              <span className="text-muted-foreground text-xs">
                {formatTime(message.createdAt)}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={submit} className="flex gap-2">
        <Textarea
          aria-label="Sua mensagem"
          value={content}
          onChange={event => setContent(event.target.value)}
          disabled={isPending}
          rows={2}
          autoFocus
          onKeyDown={event => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <Button type="submit" disabled={isPending || !content.trim()}>
          Enviar
        </Button>
      </form>
      {sendError && <p className="text-sm text-destructive">{sendError}</p>}
    </div>
  );
}
