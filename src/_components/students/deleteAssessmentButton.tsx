'use client';

import { deleteAssessment } from '@/_actions/students/deleteAssessment';
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
import { useConfirmedAction } from '@/_hooks/useConfirmedAction';
import { formatIsoDay } from '@/_lib/studentsDates';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useServerAction } from 'zsa-react';
import { FormError } from './formError';

interface DeleteAssessmentButtonProps {
  studentId: string;
  assessmentId: string;
  assessedOn: string;
}

/** Deleting asks first, naming the date of the assessment. */
export function DeleteAssessmentButton({
  studentId,
  assessmentId,
  assessedOn,
}: DeleteAssessmentButtonProps) {
  const router = useRouter();
  const action = useServerAction(deleteAssessment);
  const confirmed = useConfirmedAction(
    action.execute,
    { studentId, assessmentId },
    () => router.refresh()
  );
  const date = formatIsoDay(assessedOn);

  return (
    <AlertDialog onOpenChange={confirmed.clearError}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-11 md:size-9"
          aria-label={`Excluir avaliação de ${date}`}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir a avaliação de {date}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta avaliação será excluída permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormError message={confirmed.error} />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={action.isPending}>
            Cancelar
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={confirmed.run}
            disabled={action.isPending}
          >
            {action.isPending ? 'Excluindo…' : 'Excluir'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
