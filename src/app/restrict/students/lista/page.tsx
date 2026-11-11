import DefaultLayout from '@/_components/layout/defaultLayout';
import { StudentsView } from '@/_components/students/studentsView';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { loadBillingAccount } from '@/_lib/billingData';
import { loadEducatorEmployments } from '@/_lib/educatorEmploymentData';
import { redirectUnlessEducator } from '@/_lib/studentsAuthorization';
import { isLoadFailure, loadStudents } from '@/_lib/studentsData';
import { parseStudentsParams } from '@/_lib/studentsList';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: PAGE_TITLES.studentsList,
};

interface StudentsListPageProps {
  searchParams: Promise<{
    q?: string | string[];
    page?: string | string[];
    ordem?: string | string[];
    pendentes?: string | string[];
  }>;
}

/**
 * "Alunos" (lista completa): unchanged behavior from before the portfolio
 * dashboard became the default landing view at `/restrict/students`
 * (ADR-007) — only its URL moved, so it stays reachable via the dashboard's
 * own link.
 */
export default async function StudentsListPage({
  searchParams,
}: StudentsListPageProps) {
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
      <div className="flex flex-col gap-4">
        <Link
          href="/restrict/students"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          ← Voltar ao painel
        </Link>
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
      </div>
    </DefaultLayout>
  );
}
