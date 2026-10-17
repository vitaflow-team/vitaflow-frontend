'use client';

import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { AddPatientForm } from './addPatientForm';

interface AddPatientPanelProps {
  triggerLabel?: string;
}

/** The "add patient" panel; the form starts over every time it opens. */
export function AddPatientPanel({
  triggerLabel = 'Adicionar paciente',
}: AddPatientPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus aria-hidden="true" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar paciente</DialogTitle>
          <DialogDescription>
            Informe nome e pelo menos um contato. Se o e-mail já corresponder a
            uma conta Vita Flow, o vínculo é feito automaticamente.
          </DialogDescription>
        </DialogHeader>
        {open && <AddPatientForm onDone={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}
