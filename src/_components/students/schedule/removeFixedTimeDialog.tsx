'use client';

import { removeFixedTime } from '@/_actions/students/schedule/removeFixedTime';
import { Button } from '@/_components/ui/button';
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
import { weekdayName } from '@/_lib/scheduleFormat';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';
import { FormError } from '../formError';

interface RemoveFixedTimeDialogProps {
  studentId: string;
  fixedTimeId: string;
  weekday: number;
  time: string;
}

/** Removing asks first and cancels the future sessions of this time; the student is told. */
export function RemoveFixedTimeDialog({
  studentId,
  fixedTimeId,
  weekday,
  time,
}: RemoveFixedTimeDialogProps) {
  const router = useRouter();
  const remove = useServerAction(removeFixedTime);
  const [failure, setFailure] = useState<string | null>(null);

  async function confirm() {
    if (remove.isPending) return;
    setFailure(null);
    const [, error] = await remove.execute({ studentId, fixedTimeId });
    if (error) return setFailure(error.message);
    router.refresh();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={remove.isPending}
        >
          Remover
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remover horário de {weekdayName(weekday).toLowerCase()} às {time}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            As sessões futuras deste horário saem da agenda e o aluno é avisado.
            O histórico que já aconteceu é mantido.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormError message={failure} />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => void confirm()}>
            Remover horário
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
