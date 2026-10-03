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
import { NewWorkoutForm } from './newWorkoutForm';

interface NewWorkoutDialogProps {
  studentId: string;
  triggerLabel?: string;
}

/** "Novo treino": a title is required, then the editor opens on a fresh draft. */
export function NewWorkoutDialog({
  studentId,
  triggerLabel = 'Novo treino',
}: NewWorkoutDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus aria-hidden="true" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo treino</DialogTitle>
          <DialogDescription>
            Dê um nome ao treino. Ele começa como rascunho e o aluno só o vê
            quando você o ativar.
          </DialogDescription>
        </DialogHeader>
        <NewWorkoutForm studentId={studentId} />
      </DialogContent>
    </Dialog>
  );
}
