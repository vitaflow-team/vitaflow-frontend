import { EXERCISE_STATUS_LABELS } from '@/_constants/exerciseCatalog';
import { cn } from '@/_lib/utils';
import type { Exercise } from '@/_types/exercise';
import type { ExerciseStatus } from '@/_types/exerciseStatus';

const STATUS_STYLES: Record<ExerciseStatus, string> = {
  PENDING: 'bg-secondary text-secondary-foreground',
  APPROVED: 'bg-primary text-primary-foreground',
  REJECTED: 'bg-destructive text-white',
};

interface SubmissionListProps {
  submissions: Exercise[];
}

/**
 * The educator's own submissions with their review status (US-007). A
 * rejection reason shows only when the reviewer wrote one (US-007.EC-2).
 */
export function SubmissionList({ submissions }: SubmissionListProps) {
  if (submissions.length === 0) {
    return (
      <p className="text-muted-foreground rounded-lg border border-dashed p-6 text-center">
        Você ainda não enviou nenhuma sugestão de exercício.
      </p>
    );
  }

  return (
    <ul aria-label="Minhas sugestões" className="flex flex-col gap-2">
      {submissions.map(submission => (
        <li key={submission.id} className="bg-card rounded-lg border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold break-words">{submission.name}</span>
            <span
              className={cn(
                'rounded-full px-3 py-0.5 text-xs font-medium',
                STATUS_STYLES[submission.status]
              )}
            >
              {EXERCISE_STATUS_LABELS[submission.status]}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            {submission.muscleGroup}
          </p>
          {submission.status === 'REJECTED' && submission.rejectionReason && (
            <p className="mt-2 text-sm">Motivo: {submission.rejectionReason}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
