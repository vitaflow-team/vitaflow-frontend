'use client';

import { approveExercise } from '@/_actions/exercises/approveExercise';
import { rejectExercise } from '@/_actions/exercises/rejectExercise';
import { Button } from '@/_components/ui/button';
import { useExerciseMutation } from '@/_hooks/useExerciseMutation';
import { RejectDialog } from './rejectDialog';

interface ReviewActionsProps {
  exerciseId: string;
  exerciseName: string;
}

/** Approve or reject one pending submission (US-008, US-009). */
export function ReviewActions({
  exerciseId,
  exerciseName,
}: ReviewActionsProps) {
  const { run, isPending } = useExerciseMutation();

  return (
    <div className="flex gap-2">
      <Button
        disabled={isPending}
        onClick={() =>
          run(
            () => approveExercise({ id: exerciseId }),
            'Sugestão aprovada e publicada no catálogo.'
          )
        }
      >
        Aprovar
      </Button>
      <RejectDialog
        exerciseName={exerciseName}
        disabled={isPending}
        onReject={reason =>
          run(
            () => rejectExercise({ id: exerciseId, reason }),
            'Sugestão recusada.'
          )
        }
      />
    </div>
  );
}
