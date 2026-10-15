'use client';

import { removeTurma } from '@/_actions/academia/turmas/removeTurma';
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
import { FormError } from '@/_components/students/formError';
import { useConfirmedAction } from '@/_hooks/useConfirmedAction';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useServerAction } from 'zsa-react';

interface RemoveTurmaButtonProps {
  turmaId: string;
  name: string;
  enrolledCount: number;
}

export function RemoveTurmaButton({
  turmaId,
  name,
  enrolledCount,
}: RemoveTurmaButtonProps) {
  const router = useRouter();
  const action = useServerAction(removeTurma);
  const confirmed = useConfirmedAction(action.execute, { turmaId }, () => {
    router.refresh();
  });

  return (
    <AlertDialog onOpenChange={confirmed.clearError}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 aria-hidden="true" />
          Remover
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover {name}?</AlertDialogTitle>
          <AlertDialogDescription>
            {enrolledCount > 0
              ? `${enrolledCount} ${enrolledCount === 1 ? 'aluno inscrito perderá' : 'alunos inscritos perderão'} acesso a esta turma. O histórico de inscrições é mantido.`
              : 'Esta turma sai da agenda. O histórico é mantido.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormError message={confirmed.error} />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={action.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmed.run}
            disabled={action.isPending}
          >
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
