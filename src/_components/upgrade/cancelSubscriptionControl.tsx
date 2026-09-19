'use client';

import { actionCancelSubscription } from '@/_actions/stripe/cancelSubscription';
import { actionReactivateSubscription } from '@/_actions/stripe/reactivateSubscription';
import { useAlertHook } from '@/_hooks/alertHook';
import { useRouter } from 'next/navigation';
import { useServerAction } from 'zsa-react';
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
import { Button } from '../ui/button';

interface CancelSubscriptionControlProps {
  subscriptionCancelAt: string | null;
}

export function CancelSubscriptionControl({
  subscriptionCancelAt,
}: CancelSubscriptionControlProps) {
  const cancelAction = useServerAction(actionCancelSubscription);
  const reactivateAction = useServerAction(actionReactivateSubscription);
  const { openError } = useAlertHook();
  const router = useRouter();

  const isPending = cancelAction.isPending || reactivateAction.isPending;

  async function handleCancel() {
    const [data, error] = await cancelAction.execute();
    if (error) {
      openError(
        error.message || 'Erro ao cancelar assinatura.',
        'Atenção!',
        'error'
      );
      return;
    }
    const dateLabel = data?.cancelAt
      ? new Date(data.cancelAt).toLocaleDateString('pt-BR')
      : 'o fim do período atual';
    openError(
      `Sua assinatura permanece ativa até ${dateLabel}, depois volta para o plano Gratuito.`,
      'Cancelamento agendado',
      'success'
    );
    router.refresh();
  }

  async function handleReactivate() {
    const [, error] = await reactivateAction.execute();
    if (error) {
      openError(
        error.message || 'Erro ao reativar assinatura.',
        'Atenção!',
        'error'
      );
      return;
    }
    openError('Sua assinatura foi reativada.', 'Tudo certo!', 'success');
    router.refresh();
  }

  if (subscriptionCancelAt) {
    const dateLabel = new Date(subscriptionCancelAt).toLocaleDateString(
      'pt-BR'
    );
    return (
      <div className="flex flex-col gap-2 w-full">
        <p className="text-xs text-muted-foreground text-center">
          Cancela em {dateLabel}
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleReactivate}
          disabled={isPending}
        >
          {reactivateAction.isPending ? 'Reativando…' : 'Reativar assinatura'}
        </Button>
      </div>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full text-destructive">
          Cancelar assinatura
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar sua assinatura?</AlertDialogTitle>
          <AlertDialogDescription>
            Você continua com acesso a este plano até o fim do período já pago.
            Depois disso, sua conta volta para o plano Gratuito.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Manter assinatura</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel} disabled={isPending}>
            {cancelAction.isPending ? 'Cancelando…' : 'Cancelar assinatura'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
