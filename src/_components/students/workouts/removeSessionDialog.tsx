'use client';

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
import { Button } from '@/_components/ui/button';
import { Trash2 } from 'lucide-react';

interface RemoveSessionDialogProps {
  label: string;
  name: string;
  exerciseCount: number;
  onConfirm: () => void;
}

/** Removing a session asks first; the sessions after it take the next labels. */
export function RemoveSessionDialog({
  label,
  name,
  exerciseCount,
  onConfirm,
}: RemoveSessionDialogProps) {
  const title =
    name.trim() === '' ? `a sessão ${label}` : `a sessão ${label} — ${name}`;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Trash2 aria-hidden="true" />
          Remover sessão
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover {title}?</AlertDialogTitle>
          <AlertDialogDescription>
            {exerciseCount > 0
              ? `Os ${exerciseCount} exercícios dela saem do treino. `
              : ''}
            As sessões seguintes passam a usar as letras seguintes. A mudança só
            vale depois de salvar o treino.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Remover sessão
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
