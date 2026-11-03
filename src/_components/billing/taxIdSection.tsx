'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { Button } from '@/_components/ui/button';
import type { TaxId } from '@/_types/billing';
import { useState } from 'react';
import { ReplaceTaxIdForm } from './replaceTaxIdForm';

interface TaxIdSectionProps {
  clientId: string;
  taxId: TaxId;
}

/** Shows the stored CPF/CNPJ masked, never the full number (US-016 (AC-4), UT-127). */
export function TaxIdSection({ clientId, taxId }: TaxIdSectionProps) {
  const [open, setOpen] = useState(false);
  if (!taxId.present) return null;

  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span>CPF/CNPJ: {taxId.masked}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Substituir
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Substituir CPF ou CNPJ</DialogTitle>
          </DialogHeader>
          <ReplaceTaxIdForm clientId={clientId} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
