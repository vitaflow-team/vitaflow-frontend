import { BackofficeFormLayout } from '@/_components/exercises/backofficeFormLayout';
import { ExerciseForm } from '@/_components/exercises/exerciseForm';
import { EXERCISE_PAGE_TITLES } from '@/_constants/exerciseCatalog';
import { redirectUnlessBackoffice } from '@/_lib/backofficeAuthorization';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: EXERCISE_PAGE_TITLES.backofficeForm,
};

export default async function NewExercisePage() {
  await redirectUnlessBackoffice();

  return (
    <BackofficeFormLayout title="Novo exercício">
      <ExerciseForm mode={{ kind: 'create' }} />
    </BackofficeFormLayout>
  );
}
