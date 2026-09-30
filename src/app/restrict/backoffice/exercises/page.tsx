import { BackofficeCatalog } from '@/_components/exercises/backofficeCatalog';
import { LoadFailureNotice } from '@/_components/exercises/loadFailureNotice';
import { PendingQueue } from '@/_components/exercises/pendingQueue';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { EXERCISE_PAGE_TITLES } from '@/_constants/exerciseCatalog';
import { redirectAccessDenied } from '@/_lib/accessDenied';
import {
  isLoadFailure,
  loadExercises,
  loadPendingQueue,
} from '@/_lib/exerciseCatalog';
import { parseExerciseFilter } from '@/_lib/exerciseFilter';
import type { ExerciseSearchParams } from '@/_types/exerciseSearchParams';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: EXERCISE_PAGE_TITLES.backoffice,
};

interface BackofficeExercisesPageProps {
  searchParams: Promise<ExerciseSearchParams>;
}

/**
 * Catalog management for Vita Flow staff. The pending queue doubles as the
 * access check: anyone the backend does not confirm as staff (including a
 * backend that cannot answer) is sent away before anything renders.
 */
export default async function BackofficeExercisesPage({
  searchParams,
}: BackofficeExercisesPageProps) {
  const filter = parseExerciseFilter(await searchParams);
  const [pending, exercises] = await Promise.all([
    loadPendingQueue(),
    loadExercises(filter),
  ]);
  if (isLoadFailure(pending)) redirectAccessDenied();

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6">
        <header className="border-primary border-b pb-3">
          <h1 className="text-2xl font-semibold">Catálogo de exercícios</h1>
          <p className="text-muted-foreground text-sm">
            Revise sugestões de educadores e mantenha o catálogo correto.
          </p>
        </header>
        <section
          aria-labelledby="pending-queue"
          className="flex flex-col gap-3"
        >
          <h2 id="pending-queue" className="text-lg font-semibold">
            Sugestões pendentes
          </h2>
          <PendingQueue submissions={pending} />
        </section>
        {isLoadFailure(exercises) ? (
          <LoadFailureNotice message="Não foi possível carregar o catálogo. Tente novamente mais tarde." />
        ) : (
          <BackofficeCatalog exercises={exercises} filter={filter} />
        )}
      </div>
    </DefaultLayout>
  );
}
