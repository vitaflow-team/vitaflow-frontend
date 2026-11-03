'use client';

import { resendInvoice } from '@/_actions/billing/resendInvoice';
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
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

interface ResendInvoiceDialogProps {
  invoiceId: string;
  canResendAt: string | null;
}

/** Resends the payment link e-mail; the backend enforces the hourly cooldown (US-008). */
export function ResendInvoiceDialog({
  invoiceId,
  canResendAt,
}: ResendInvoiceDialogProps) {
  const { execute, isPending } = useServerAction(resendInvoice);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const inCooldown =
    Boolean(canResendAt) && new Date(canResendAt!) > new Date();

  async function handleResend() {
    const [, actionError] = await execute({ id: invoiceId });
    if (actionError) {
      setError(actionError.message);
      return;
    }
    setSent(true);
  }

  return (
    <AlertDialog
      onOpenChange={() => {
        setError(null);
        setSent(false);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={inCooldown}>
          Reenviar e-mail
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reenviar o e-mail de cobrança?</AlertDialogTitle>
          <AlertDialogDescription>
            O aluno recebe o mesmo link de pagamento novamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormError message={error} />
        {sent && (
          <p className="text-sm text-muted-foreground">E-mail reenviado.</p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Fechar</AlertDialogCancel>
          <Button onClick={handleResend} disabled={isPending || sent}>
            {isPending ? 'Enviando…' : 'Reenviar'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
