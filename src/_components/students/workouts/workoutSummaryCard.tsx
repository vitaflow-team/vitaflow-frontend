import { WORKOUT_STATUS_LABELS } from '@/_constants/educatorWorkoutLimits';
import { formatTimestampDay } from '@/_lib/studentsDates';
import { workoutEditorHref } from '@/_lib/workoutLinks';
import type { WorkoutSummary } from '@/_types/educatorWorkouts';
import { Archive, CircleCheck, FilePen } from 'lucide-react';
import Link from 'next/link';

const STATUS_ICONS = {
  DRAFT: FilePen,
  ACTIVE: CircleCheck,
  ARCHIVED: Archive,
} as const;

interface WorkoutSummaryCardProps {
  studentId: string;
  workout: WorkoutSummary;
}

/** One workout of the list; the status is a word and an icon, never color alone. */
export function WorkoutSummaryCard({
  studentId,
  workout,
}: WorkoutSummaryCardProps) {
  const Icon = STATUS_ICONS[workout.status];

  return (
    <li className="border-b border-line last:border-b-0">
      <Link
        href={workoutEditorHref(studentId, workout.id)}
        className="flex flex-col gap-1 px-2 py-3 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
      >
        <span className="flex flex-wrap items-center gap-2">
          <span className="min-w-0 truncate font-medium">{workout.title}</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-xs font-medium">
            <Icon className="size-3" aria-hidden="true" />
            {WORKOUT_STATUS_LABELS[workout.status]}
          </span>
        </span>
        <span className="text-sm text-muted-foreground">
          {workout.sessionCount}{' '}
          {workout.sessionCount === 1 ? 'sessão' : 'sessões'} ·{' '}
          {workout.exerciseCount}{' '}
          {workout.exerciseCount === 1 ? 'exercício' : 'exercícios'} ·
          Atualizado em {formatTimestampDay(workout.updatedAt)}
        </span>
      </Link>
    </li>
  );
}
