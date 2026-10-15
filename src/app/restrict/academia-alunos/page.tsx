import DefaultLayout from '@/_components/layout/defaultLayout';
import { AcademiaAlunosView } from '@/_components/academia-alunos/academiaAlunosView';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { redirectUnlessAcademiaOwner } from '@/_lib/academiaAuthorization';
import { isLoadFailure, loadAcademiaAlunos } from '@/_lib/academiaAlunosData';
import { parseAcademiaAlunosParams } from '@/_lib/academiaAlunosList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.academiaAlunos,
};

interface AcademiaAlunosPageProps {
  searchParams: Promise<{
    q?: string | string[];
    horario?: string | string[];
    page?: string | string[];
  }>;
}

export default async function AcademiaAlunosPage({
  searchParams,
}: AcademiaAlunosPageProps) {
  await redirectUnlessAcademiaOwner();
  const params = parseAcademiaAlunosParams(await searchParams);
  const data = await loadAcademiaAlunos(params);

  return (
    <DefaultLayout>
      {isLoadFailure(data) ? (
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar os alunos. Tente novamente em alguns
          instantes.
        </p>
      ) : (
        <AcademiaAlunosView
          list={data.list}
          employments={data.employments}
          search={params.search}
          horario={params.horario}
        />
      )}
    </DefaultLayout>
  );
}
