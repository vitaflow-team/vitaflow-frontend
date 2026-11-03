'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { Button } from '@/_components/ui/button';
import type { Invoice } from '@/_types/billing';
import { useState } from 'react';
import { EditInvoiceForm } from './editInvoiceForm';

interface EditInvoiceDialogProps {
  invoice: Invoice;
}

export function EditInvoiceDialog({ invoice }: EditInvoiceDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Editar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar cobrança</DialogTitle>
        </DialogHeader>
        <EditInvoiceForm invoice={invoice} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
