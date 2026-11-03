'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { Button } from '@/_components/ui/button';
import { useState } from 'react';
import { MarkPaidForm } from './markPaidForm';

interface MarkPaidInvoiceDialogProps {
  invoiceId: string;
}

export function MarkPaidInvoiceDialog({
  invoiceId,
}: MarkPaidInvoiceDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Marcar como paga</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar pagamento recebido fora do Asaas</DialogTitle>
        </DialogHeader>
        <MarkPaidForm invoiceId={invoiceId} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
