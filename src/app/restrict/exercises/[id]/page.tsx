import { CatalogAttribution } from '@/_components/exercises/catalogAttribution';
import { ExerciseDetail } from '@/_components/exercises/exerciseDetail';
import { LoadFailureNotice } from '@/_components/exercises/loadFailureNotice';
import DefaultLayout from '@/_components/layout/defaultLayout';
import {
  EXERCISE_PAGE_TITLES,
  EXERCISE_ROUTES,
} from '@/_constants/exerciseCatalog';
import { isLoadFailure, loadExercise } from '@/_lib/exerciseCatalog';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: EXERCISE_PAGE_TITLES.exercise,
};

interface ExercisePageProps {
  params: Promise<{ id: string }>;
}

export default async function ExercisePage({ params }: ExercisePageProps) {
  const { id } = await params;
  const exercise = await loadExercise(id);
  if (exercise === 'not-found') notFound();

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <Link
          href={EXERCISE_ROUTES.LIBRARY}
          className="text-primary w-fit text-sm underline-offset-4 hover:underline"
        >
          ← Voltar para os exercícios
        </Link>
        {isLoadFailure(exercise) ? (
          <LoadFailureNotice message="Não foi possível carregar o exercício. Tente novamente mais tarde." />
        ) : (
          <ExerciseDetail exercise={exercise} />
        )}
        <CatalogAttribution />
      </div>
    </DefaultLayout>
  );
}
