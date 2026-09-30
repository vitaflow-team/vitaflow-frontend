import { ExerciseForm } from '@/_components/exercises/exerciseForm';
import { LoadFailureNotice } from '@/_components/exercises/loadFailureNotice';
import { SubmissionList } from '@/_components/exercises/submissionList';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { EXERCISE_PAGE_TITLES } from '@/_constants/exerciseCatalog';
import { redirectAccessDenied } from '@/_lib/accessDenied';
import { isLoadFailure, loadOwnSubmissions } from '@/_lib/exerciseCatalog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: EXERCISE_PAGE_TITLES.submissions,
};

/**
 * Educator submission form and status list (US-006, US-007). The backend
 * answers 403 to anyone who is not a physical educator, and so does this page.
 */
export default async function SubmissionsPage() {
  const submissions = await loadOwnSubmissions();
  if (submissions === 'forbidden') redirectAccessDenied();

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6">
        <header className="border-primary border-b pb-3">
          <h1 className="text-2xl font-semibold">Sugerir exercício</h1>
          <p className="text-muted-foreground text-sm">
            Sua sugestão passa pela revisão da equipe Vita Flow antes de entrar
            no catálogo.
          </p>
        </header>
        <ExerciseForm mode={{ kind: 'submit' }} />
        <section
          aria-labelledby="my-submissions"
          className="flex flex-col gap-3"
        >
          <h2 id="my-submissions" className="text-lg font-semibold">
            Minhas sugestões
          </h2>
          {isLoadFailure(submissions) ? (
            <LoadFailureNotice message="Não foi possível carregar suas sugestões. Tente novamente mais tarde." />
          ) : (
            <SubmissionList submissions={submissions} />
          )}
        </section>
      </div>
    </DefaultLayout>
  );
}
