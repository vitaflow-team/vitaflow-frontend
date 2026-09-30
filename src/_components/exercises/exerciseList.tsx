import { hasActiveFilter } from '@/_lib/exerciseFilter';
import type { Exercise } from '@/_types/exercise';
import type { ExerciseFilter } from '@/_types/exerciseFilter';
import type { ReactNode } from 'react';
import { ExerciseEmptyState } from './exerciseEmptyState';
import { ExerciseListItem } from './exerciseListItem';
import { ExercisePagination } from './exercisePagination';

interface ExerciseListProps {
  exercises: Exercise[];
  filter: ExerciseFilter;
  basePath: string;
  /** Per-row controls, for the backoffice list. */
  renderActions?: (exercise: Exercise) => ReactNode;
}

export function ExerciseList({
  exercises,
  filter,
  basePath,
  renderActions,
}: ExerciseListProps) {
  // Past the last page the list is empty too, but that is still "nothing here
  // for these filters", not an empty catalog.
  const filtered = hasActiveFilter(filter) || filter.page > 1;

  if (exercises.length === 0) {
    return <ExerciseEmptyState filtered={filtered} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <ul aria-label="Exercícios" className="flex flex-col gap-2">
        {exercises.map(exercise => (
          <ExerciseListItem
            key={exercise.id}
            exercise={exercise}
            actions={renderActions?.(exercise)}
          />
        ))}
      </ul>
      <ExercisePagination
        filter={filter}
        count={exercises.length}
        basePath={basePath}
      />
    </div>
  );
}
