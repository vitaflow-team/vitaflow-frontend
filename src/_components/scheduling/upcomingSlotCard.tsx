'use client';

import { actionCancelFixedSession } from '@/_actions/scheduling/cancelFixedSession';
import { actionCancelSlot } from '@/_actions/scheduling/cancelSlot';
import { actionSetFixedSessionLink } from '@/_actions/scheduling/setFixedSessionLink';
import { actionSetOnlineLink } from '@/_actions/scheduling/setOnlineLink';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/_components/ui/alert-dialog';
import { Button } from '@/_components/ui/button';
import { Input } from '@/_components/ui/input';
import { useAlertHook } from '@/_hooks/alertHook';
import type { UpcomingSlot } from '@/_types/scheduling';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface UpcomingSlotCardProps {
  slot: UpcomingSlot;
  viewerIsProfessional: boolean;
}

const FALLBACK = 'Não foi possível concluir a ação. Tente novamente.';

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** US-003/US-007: one upcoming session, from either side — join link or
 * link-editing (US-009), and cancellation (US-004/US-008). */
export function UpcomingSlotCard({
  slot,
  viewerIsProfessional,
}: UpcomingSlotCardProps) {
  const { openError } = useAlertHook();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [linkDraft, setLinkDraft] = useState(slot.onlineLink ?? '');

  async function cancel() {
    setIsPending(true);
    try {
      // A fixed session is canceled for this one date; a booking reopens the slot.
      const [, error] =
        slot.source === 'FIXED'
          ? await actionCancelFixedSession({ slotId: slot.id })
          : await actionCancelSlot({ slotId: slot.id });
      if (error) {
        openError(error.message || FALLBACK, 'Atenção!', 'error');
      } else {
        openError('Sessão cancelada.', 'Pronto!', 'success');
        router.refresh();
      }
    } finally {
      setIsPending(false);
    }
  }

  async function saveLink(event: React.FormEvent) {
    event.preventDefault();
    setIsPending(true);
    try {
      const save =
        slot.source === 'FIXED'
          ? actionSetFixedSessionLink
          : actionSetOnlineLink;
      const [, error] = await save({
        slotId: slot.id,
        link: linkDraft,
      });
      if (error) {
        openError(error.message || FALLBACK, 'Atenção!', 'error');
      } else {
        openError('Link salvo.', 'Pronto!', 'success');
        router.refresh();
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <li className="bg-card flex flex-col gap-2 rounded-lg border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold">{slot.counterpart.name}</p>
          <p className="text-muted-foreground text-sm">
            {formatDateTime(slot.startAt)} ·{' '}
            {slot.type === 'ONLINE' ? 'Online' : 'Presencial'}
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={isPending}>
              Cancelar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancelar esta sessão?</AlertDialogTitle>
              <AlertDialogDescription>
                {slot.counterpart.name} será avisado(a) e o horário volta a
                ficar disponível para outras pessoas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Voltar</AlertDialogCancel>
              <AlertDialogAction onClick={() => void cancel()}>
                Cancelar sessão
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {slot.type === 'ONLINE' && viewerIsProfessional && (
        <form onSubmit={saveLink} className="flex gap-2">
          <Input
            aria-label="Link da chamada"
            placeholder="https://meet.google.com/..."
            value={linkDraft}
            onChange={event => setLinkDraft(event.target.value)}
            disabled={isPending}
          />
          <Button type="submit" variant="outline" disabled={isPending}>
            Salvar link
          </Button>
        </form>
      )}

      {slot.type === 'ONLINE' && !viewerIsProfessional && (
        <>
          {slot.onlineLink ? (
            <a
              href={slot.onlineLink}
              target="_blank"
              rel="noreferrer noopener"
              className="text-primary w-fit text-sm font-semibold underline-offset-4 hover:underline"
            >
              Entrar na chamada
            </a>
          ) : (
            // US-009.AC-2
            <p className="text-muted-foreground text-sm">
              Link ainda não adicionado pelo profissional.
            </p>
          )}
        </>
      )}
    </li>
  );
}
