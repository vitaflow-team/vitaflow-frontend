'use client';

import { actionReportConversation } from '@/_actions/messages/reportConversation';
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
import { useAlertHook } from '@/_hooks/alertHook';
import { useState } from 'react';

interface ReportConversationButtonProps {
  conversationId: string;
  counterpartName: string;
}

const FALLBACK = 'Não foi possível concluir a ação. Tente novamente.';

/** US-005: report a conversation for backoffice review — quiet toward the
 * other party, no confrontational effect of any kind (E2E-002). */
export function ReportConversationButton({
  conversationId,
  counterpartName,
}: ReportConversationButtonProps) {
  const { openError } = useAlertHook();
  const [isPending, setIsPending] = useState(false);

  async function report() {
    setIsPending(true);
    try {
      const [, error] = await actionReportConversation({ id: conversationId });
      if (error) {
        openError(error.message || FALLBACK, 'Atenção!', 'error');
      } else {
        openError('Conversa reportada para análise.', 'Pronto!', 'success');
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending}>
          Reportar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Reportar conversa com {counterpartName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            A equipe Vita Flow vai revisar esta conversa. {counterpartName} não
            é notificado disso de nenhuma forma.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={report}>Reportar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
