'use client';

import {
  deleteStudent,
  type DeleteStudentResult,
} from '@/_actions/students/deleteStudent';
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
import { billingWarningsMessage } from '@/_lib/billingWarnings';
import { STUDENTS_PATH } from '@/_lib/studentsList';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';
import { FormError } from './formError';

interface RemoveStudentDialogProps {
  studentId: string;
  studentName: string;
  hasAssessments: boolean;
}

interface RemoveFooterProps {
  warning: string | null;
  isPending: boolean;
  onConfirm: () => void;
  onLeave: () => void;
}

function RemoveFooter({
  warning,
  isPending,
  onConfirm,
  onLeave,
}: RemoveFooterProps) {
  if (warning) {
    return <Button onClick={onLeave}>Entendi</Button>;
  }
  return (
    <>
      <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
      <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
        {isPending ? 'Removendo…' : 'Remover aluno'}
      </Button>
    </>
  );
}

interface RemoveHeaderProps {
  warning: string | null;
  studentName: string;
  hasAssessments: boolean;
}

function RemoveHeader({
  warning,
  studentName,
  hasAssessments,
}: RemoveHeaderProps) {
  return (
    <AlertDialogHeader>
      <AlertDialogTitle>
        {warning ? `${studentName} foi removido` : `Remover ${studentName}?`}
      </AlertDialogTitle>
      <AlertDialogDescription>
        {warning ?? removalWarning(hasAssessments)}
      </AlertDialogDescription>
    </AlertDialogHeader>
  );
}

function useRemoveFlow(studentId: string) {
  const router = useRouter();
  const action = useServerAction(deleteStudent);
  const [warning, setWarning] = useState<string | null>(null);

  function leave() {
    router.push(STUDENTS_PATH);
    router.refresh();
  }

  const confirmed = useConfirmedAction<{ id: string }, DeleteStudentResult>(
    action.execute,
    { id: studentId },
    data => {
      const message = billingWarningsMessage(data.billingWarnings);
      if (message) setWarning(message);
      else leave();
    }
  );

  return { action, warning, confirmed, leave };
}

/** Removing needs a confirmation that names the student and the loss. */
export function RemoveStudentDialog({
  studentId,
  studentName,
  hasAssessments,
}: RemoveStudentDialogProps) {
  const { action, warning, confirmed, leave } = useRemoveFlow(studentId);

  return (
    <AlertDialog
      onOpenChange={open => {
        if (!open) {
          confirmed.clearError();
          if (warning) leave();
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Trash2 aria-hidden="true" />
          Remover
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <RemoveHeader
          warning={warning}
          studentName={studentName}
          hasAssessments={hasAssessments}
        />
        <FormError message={confirmed.error} />
        <AlertDialogFooter>
          <RemoveFooter
            warning={warning}
            isPending={action.isPending}
            onConfirm={confirmed.run}
            onLeave={leave}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
