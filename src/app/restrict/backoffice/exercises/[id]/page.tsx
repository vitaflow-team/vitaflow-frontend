import { BackofficeFormLayout } from '@/_components/exercises/backofficeFormLayout';
import { ExerciseForm } from '@/_components/exercises/exerciseForm';
import { LoadFailureNotice } from '@/_components/exercises/loadFailureNotice';
import { EXERCISE_PAGE_TITLES } from '@/_constants/exerciseCatalog';
import { redirectUnlessBackoffice } from '@/_lib/backofficeAuthorization';
import { isLoadFailure, loadExercise } from '@/_lib/exerciseCatalog';
import { toExerciseFormInput } from '@/_lib/exercisePayload';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: EXERCISE_PAGE_TITLES.backofficeForm,
};

interface EditExercisePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExercisePage({
  params,
}: EditExercisePageProps) {
  await redirectUnlessBackoffice();

  const { id } = await params;
  const exercise = await loadExercise(id);
  if (exercise === 'not-found') notFound();

  return (
    <BackofficeFormLayout title="Editar exercício">
      {isLoadFailure(exercise) ? (
        <LoadFailureNotice message="Não foi possível carregar o exercício. Tente novamente mais tarde." />
      ) : (
        <ExerciseForm
          mode={{ kind: 'edit', id: exercise.id }}
          defaultValues={toExerciseFormInput(exercise)}
        />
      )}
    </BackofficeFormLayout>
  );
}
