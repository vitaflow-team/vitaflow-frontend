import DefaultLayout from '@/_components/layout/defaultLayout';
import { EducatorDashboardView } from '@/_components/educator-dashboard/educatorDashboardView';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import {
  isLoadFailure,
  loadEducatorDashboard,
} from '@/_lib/educatorDashboardData';
import { redirectUnlessEducator } from '@/_lib/studentsAuthorization';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.students,
};

/**
 * The physical educator's portfolio dashboard — the default landing view
 * for "Alunos" (ADR-007). The previous flat list moved to
 * `/restrict/students/lista`, linked from the dashboard below.
 */
export default async function StudentsPage() {
  await redirectUnlessEducator();
  const summary = await loadEducatorDashboard();

  return (
    <DefaultLayout>
      {isLoadFailure(summary) ? (
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar o painel de alunos. Tente novamente em
          alguns instantes.
        </p>
      ) : (
        <EducatorDashboardView summary={summary} />
      )}
    </DefaultLayout>
  );
}
