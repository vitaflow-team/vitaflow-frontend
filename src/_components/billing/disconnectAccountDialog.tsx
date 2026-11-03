'use client';

import { disconnectAccount } from '@/_actions/billing/disconnectAccount';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/_components/ui/alert-dialog';
import { Button } from '@/_components/ui/button';
import { FormError } from '@/_components/students/formError';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

interface DisconnectAccountDialogProps {
  openInvoiceCount: number;
}

/** States the number of open invoices, since links keep working after disconnect. */
function disconnectWarning(openInvoiceCount: number): string {
  if (openInvoiceCount === 0) {
    return 'Você não tem cobranças em aberto no momento. Os links de cobranças já enviadas continuam funcionando, mas elas deixam de ser atualizadas até você reconectar.';
  }
  const plural = openInvoiceCount === 1 ? '' : 's';
  return `Você tem ${openInvoiceCount} cobrança${plural} em aberto. Os links continuam funcionando, mas elas deixam de ser atualizadas até você reconectar.`;
}

export function DisconnectAccountDialog({
  openInvoiceCount,
}: DisconnectAccountDialogProps) {
  const router = useRouter();
  const { execute, isPending } = useServerAction(disconnectAccount);
  const [error, setError] = useState<string | null>(null);

  async function handleDisconnect() {
    const [, actionError] = await execute();
    if (actionError) {
      setError(actionError.message);
      return;
    }
    router.refresh();
  }

  return (
    <AlertDialog onOpenChange={() => setError(null)}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Desconectar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desconectar sua conta Asaas?</AlertDialogTitle>
          <AlertDialogDescription>
            {disconnectWarning(openInvoiceCount)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormError message={error} />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDisconnect}
            disabled={isPending}
          >
            {isPending ? 'Desconectando…' : 'Desconectar'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
