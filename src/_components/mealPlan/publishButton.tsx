'use client';

import { publishMealPlan } from '@/_actions/mealPlan/publishMealPlan';
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
import { useAlertHook } from '@/_hooks/alertHook';
import { useConfirmedAction } from '@/_hooks/useConfirmedAction';
import { useRouter } from 'next/navigation';
import { useServerAction } from 'zsa-react';

interface PublishButtonProps {
  clientId: string;
}

/** Publishing is irreversible for that version (US-014) — confirmed up front. */
export function PublishButton({ clientId }: PublishButtonProps) {
  const router = useRouter();
  const { openError } = useAlertHook();
  const action = useServerAction(publishMealPlan);
  const confirmed = useConfirmedAction(action.execute, { clientId }, () => {
    openError('Plano alimentar publicado.', 'Pronto!', 'success');
    router.refresh();
  });

  return (
    <AlertDialog onOpenChange={confirmed.clearError}>
      <AlertDialogTrigger asChild>
        <Button type="button">Publicar plano</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Publicar este plano?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta versão fica permanente no histórico e não pode ser alterada
            depois de publicada. O paciente passa a ver estas refeições
            imediatamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormError message={confirmed.error} />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmed.run}
            disabled={action.isPending}
          >
            {action.isPending ? 'Publicando…' : 'Publicar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
