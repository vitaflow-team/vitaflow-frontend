import DefaultLayout from '@/_components/layout/defaultLayout';
import { StudentsView } from '@/_components/students/studentsView';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { loadBillingAccount } from '@/_lib/billingData';
import { loadEducatorEmployments } from '@/_lib/educatorEmploymentData';
import { redirectUnlessEducator } from '@/_lib/studentsAuthorization';
import { isLoadFailure, loadStudents } from '@/_lib/studentsData';
import { parseStudentsParams } from '@/_lib/studentsList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.students,
};

interface StudentsPageProps {
  searchParams: Promise<{
    q?: string | string[];
    page?: string | string[];
    ordem?: string | string[];
    pendentes?: string | string[];
  }>;
}

/** "Alunos": the physical educator's own students (E1). */
export default async function StudentsPage({
  searchParams,
}: StudentsPageProps) {
  await redirectUnlessEducator();
  const params = parseStudentsParams(await searchParams);
  const [list, employments, account] = await Promise.all([
    loadStudents(params),
    loadEducatorEmployments(),
    loadBillingAccount(),
  ]);
  const isPremium = !isLoadFailure(account) && account.premium;

  return (
    <DefaultLayout>
      {isLoadFailure(list) ? (
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar seus alunos. Tente novamente em alguns
          instantes.
        </p>
      ) : (
        <StudentsView
          list={list}
          search={params.search}
          order={params.order}
          pending={params.pending}
          isPremium={isPremium}
          employments={employments}
        />
      )}
    </DefaultLayout>
  );
}
