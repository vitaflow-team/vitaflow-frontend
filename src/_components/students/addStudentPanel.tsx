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
import { AddStudentFlow } from './addStudentFlow';

interface AddStudentPanelProps {
  triggerLabel?: string;
}

/** The "add student" panel; its steps start over every time it opens. */
export function AddStudentPanel({
  triggerLabel = 'Adicionar aluno',
}: AddStudentPanelProps) {
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
          <DialogTitle>Adicionar aluno</DialogTitle>
          <DialogDescription>
            Informe o e-mail do aluno. Se ele já tem conta no Vita Flow, você
            confirma o vínculo antes de cadastrar.
          </DialogDescription>
        </DialogHeader>
        {open && <AddStudentFlow onDone={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}
