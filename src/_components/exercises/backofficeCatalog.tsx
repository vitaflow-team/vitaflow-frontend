import { Button } from '@/_components/ui/button';
import { EXERCISE_ROUTES } from '@/_constants/exerciseCatalog';
import type { Exercise } from '@/_types/exercise';
import type { ExerciseFilter } from '@/_types/exerciseFilter';
import Link from 'next/link';
import { ExerciseFilters } from './exerciseFilters';
import { ExerciseList } from './exerciseList';
import { RemoveExerciseButton } from './removeExerciseButton';

interface BackofficeCatalogProps {
  exercises: Exercise[];
  filter: ExerciseFilter;
}

function RowActions({ exercise }: { exercise: Exercise }) {
  return (
    <>
      <Button asChild variant="outline" size="sm">
        <Link href={`${EXERCISE_ROUTES.BACKOFFICE}/${exercise.id}`}>
          Editar
        </Link>
      </Button>
      <RemoveExerciseButton
        exerciseId={exercise.id}
        exerciseName={exercise.name}
      />
    </>
  );
}

/** The published catalog with direct create, edit and remove (US-010). */
export function BackofficeCatalog({
  exercises,
  filter,
}: BackofficeCatalogProps) {
  return (
    <section
      aria-labelledby="backoffice-catalog"
      className="flex flex-col gap-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="backoffice-catalog" className="text-lg font-semibold">
          Catálogo publicado
        </h2>
        <Button asChild>
          <Link href={EXERCISE_ROUTES.BACKOFFICE_NEW}>Novo exercício</Link>
        </Button>
      </div>
      <ExerciseFilters filter={filter} basePath={EXERCISE_ROUTES.BACKOFFICE} />
      <ExerciseList
        exercises={exercises}
        filter={filter}
        basePath={EXERCISE_ROUTES.BACKOFFICE}
        renderActions={exercise => <RowActions exercise={exercise} />}
      />
    </section>
  );
}
