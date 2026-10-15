'use client';

import { cancelInvitation } from '@/_actions/academia/cancelInvitation';
import { endEmployment } from '@/_actions/academia/endEmployment';
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

function CancelInvitationButton({ id }: { id: string }) {
  const router = useRouter();
  const action = useServerAction(cancelInvitation);

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={action.isPending}
      onClick={async () => {
        await action.execute({ id });
        router.refresh();
      }}
    >
      {action.isPending ? 'Cancelando...' : 'Cancelar convite'}
    </Button>
  );
}

function RemoveProfessorButton({
  id,
  name,
}: {
  id: string;
  name: string | null;
}) {
  const router = useRouter();
  const action = useServerAction(endEmployment);
  const confirmed = useConfirmedAction(action.execute, { id }, () => {
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
          <AlertDialogTitle>
            Remover {name ?? 'este professor'}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Os alunos da academia atendidos por este professor continuam
            existindo, agora sem educador atribuído.
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

interface ProfessorRowActionsProps {
  id: string;
  name: string | null;
  status: 'ACTIVE' | 'PENDING';
}

export function ProfessorRowActions({
  id,
  name,
  status,
}: ProfessorRowActionsProps) {
  if (status === 'PENDING') return <CancelInvitationButton id={id} />;
  return <RemoveProfessorButton id={id} name={name} />;
}
