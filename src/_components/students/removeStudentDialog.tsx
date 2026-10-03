'use client';

import { deleteStudent } from '@/_actions/students/deleteStudent';
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
import { removalWarning } from '@/_lib/assessmentDisplay';
import { STUDENTS_PATH } from '@/_lib/studentsList';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useServerAction } from 'zsa-react';
import { FormError } from './formError';

interface RemoveStudentDialogProps {
  studentId: string;
  studentName: string;
  hasAssessments: boolean;
}

/** Removing needs a confirmation that names the student and the loss. */
export function RemoveStudentDialog({
  studentId,
  studentName,
  hasAssessments,
}: RemoveStudentDialogProps) {
  const router = useRouter();
  const action = useServerAction(deleteStudent);
  const confirmed = useConfirmedAction(
    action.execute,
    { id: studentId },
    () => {
      router.push(STUDENTS_PATH);
      router.refresh();
    }
  );

  return (
    <AlertDialog onOpenChange={confirmed.clearError}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Trash2 aria-hidden="true" />
          Remover
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover {studentName}?</AlertDialogTitle>
          <AlertDialogDescription>
            {removalWarning(hasAssessments)}
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
            {action.isPending ? 'Removendo…' : 'Remover aluno'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
