'use client';

import { cancelInvoice } from '@/_actions/billing/cancelInvoice';
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

interface CancelInvoiceDialogProps {
  invoiceId: string;
}

/** Cancels an open invoice (US-006); the backend rejects it if the gateway shows it already paid. */
export function CancelInvoiceDialog({ invoiceId }: CancelInvoiceDialogProps) {
  const router = useRouter();
  const { execute, isPending } = useServerAction(cancelInvoice);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    const [, actionError] = await execute({ id: invoiceId });
    if (actionError) {
      setError(actionError.message);
      return;
    }
    router.refresh();
  }

  return (
    <AlertDialog onOpenChange={() => setError(null)}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Cancelar cobrança</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar esta cobrança?</AlertDialogTitle>
          <AlertDialogDescription>
            O link de pagamento deixa de funcionar. Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormError message={error} />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Voltar</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isPending}
          >
            {isPending ? 'Cancelando…' : 'Cancelar cobrança'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
