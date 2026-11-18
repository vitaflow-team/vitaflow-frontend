'use client';

import { unlinkAccessPlan } from '@/_actions/academia/unlinkAccessPlan';
import { FormError } from '@/_components/students/formError';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/_components/ui/alert-dialog';
import { Button } from '@/_components/ui/button';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

interface UnlinkPlanButtonProps {
  clientId: string;
  studentName: string;
  onUnlinked: () => void;
}

/** Ends the plan and the monthly fee; fees already overdue stay owed (US-014). */
export function UnlinkPlanButton({
  clientId,
  studentName,
  onUnlinked,
}: UnlinkPlanButtonProps) {
  const { execute, isPending } = useServerAction(unlinkAccessPlan);
  const [error, setError] = useState<string | null>(null);

  async function handleUnlink() {
    const [, actionError] = await execute({ clientId });
    setError(actionError?.message ?? null);
    if (!actionError) onUnlinked();
  }

  return (
    <AlertDialog onOpenChange={() => setError(null)}>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="outline">
          Desvincular plano
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Desvincular {studentName} do plano?
          </AlertDialogTitle>
          <AlertDialogDescription>
            O plano é encerrado, as próximas mensalidades deixam de ser emitidas
            e as cobranças que ainda não venceram são canceladas. Cobranças já
            em atraso continuam em aberto.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormError message={error} />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Voltar</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={() => void handleUnlink()}
          >
            {isPending ? 'Desvinculando…' : 'Desvincular'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
