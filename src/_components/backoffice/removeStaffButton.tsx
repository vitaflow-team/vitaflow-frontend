'use client';

import { removeStaff } from '@/_actions/backoffice/removeStaff';
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
import { useAlertHook } from '@/_hooks/alertHook';
import { useRouter } from 'next/navigation';
import { useServerAction } from 'zsa-react';

interface RemoveStaffButtonProps {
  staffId: string;
  staffName: string;
}

/** Removes a staff member's internal access, with a confirmation (US-009). */
export function RemoveStaffButton({
  staffId,
  staffName,
}: RemoveStaffButtonProps) {
  const router = useRouter();
  const { openError } = useAlertHook();
  const { execute, isPending } = useServerAction(removeStaff);

  async function handleRemove() {
    const [, error] = await execute({ staffId });
    if (error) {
      openError(error.message, 'Atenção!', 'error');
      return;
    }
    openError('Acesso removido.', 'Pronto!', 'success');
    router.refresh();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending}>
          Remover acesso
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover acesso de {staffName}?</AlertDialogTitle>
          <AlertDialogDescription>
            A pessoa deixa de poder entrar em qualquer tela da equipe Vita Flow.
            O histórico de auditoria é preservado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onSelect={event => event.preventDefault()}
            onClick={handleRemove}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            Remover acesso
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
