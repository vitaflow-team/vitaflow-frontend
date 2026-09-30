import { EXERCISE_ROUTES } from '@/_constants/exerciseCatalog';
import { equipmentLabel } from '@/_lib/exerciseDisplay';
import type { Exercise } from '@/_types/exercise';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { VideoLink } from './videoLink';

interface ExerciseListItemProps {
  exercise: Exercise;
  /** Extra controls for the row (backoffice edit and remove). */
  actions?: ReactNode;
}

/** One catalog row: name, muscle group, level and equipment (US-001.AC-1). */
export function ExerciseListItem({ exercise, actions }: ExerciseListItemProps) {
  return (
    <li className="bg-card flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <Link
          href={`${EXERCISE_ROUTES.LIBRARY}/${exercise.id}`}
          className="font-semibold break-words underline-offset-4 hover:underline"
        >
          {exercise.name}
        </Link>
        <p className="text-muted-foreground flex flex-wrap gap-x-3 text-sm">
          <span>{exercise.muscleGroup}</span>
          <span>{exercise.difficulty ?? 'Nível não informado'}</span>
          <span>{equipmentLabel(exercise.equipment)}</span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <VideoLink videoUrl={exercise.videoUrl} exerciseName={exercise.name} />
        {actions}
      </div>
    </li>
  );
}
