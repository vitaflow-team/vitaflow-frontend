import { CatalogAttribution } from '@/_components/exercises/catalogAttribution';
import { ExerciseFilters } from '@/_components/exercises/exerciseFilters';
import { ExerciseLibraryHeader } from '@/_components/exercises/exerciseLibraryHeader';
import { ExerciseList } from '@/_components/exercises/exerciseList';
import { LoadFailureNotice } from '@/_components/exercises/loadFailureNotice';
import DefaultLayout from '@/_components/layout/defaultLayout';
import {
  EXERCISE_PAGE_TITLES,
  EXERCISE_ROUTES,
} from '@/_constants/exerciseCatalog';
import { getBackofficeAccess } from '@/_lib/backofficeAuthorization';
import { isLoadFailure, loadExercises } from '@/_lib/exerciseCatalog';
import { parseExerciseFilter } from '@/_lib/exerciseFilter';
import type { ExerciseSearchParams } from '@/_types/exerciseSearchParams';
import { auth } from '@/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: EXERCISE_PAGE_TITLES.library,
};

interface ExercisesPageProps {
  searchParams: Promise<ExerciseSearchParams>;
}

/** The exercise library, open to every plan (US-001.AC-2). */
export default async function ExercisesPage({
  searchParams,
}: ExercisesPageProps) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const filter = parseExerciseFilter(await searchParams);
  const [exercises, access] = await Promise.all([
    loadExercises(filter),
    getBackofficeAccess(),
  ]);

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <ExerciseLibraryHeader
          canSubmit={session.user.productType === 'PHYSICAL_EDUCATOR'}
          canManage={access === 'allowed'}
        />
        <ExerciseFilters filter={filter} basePath={EXERCISE_ROUTES.LIBRARY} />
        {isLoadFailure(exercises) ? (
          <LoadFailureNotice message="Não foi possível carregar os exercícios. Tente novamente mais tarde." />
        ) : (
          <ExerciseList
            exercises={exercises}
            filter={filter}
            basePath={EXERCISE_ROUTES.LIBRARY}
          />
        )}
        <CatalogAttribution />
      </div>
    </DefaultLayout>
  );
}
