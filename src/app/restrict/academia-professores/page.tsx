import DefaultLayout from '@/_components/layout/defaultLayout';
import { ProfessoresView } from '@/_components/professores/professoresView';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { redirectUnlessAcademiaOwner } from '@/_lib/academiaAuthorization';
import { isLoadFailure, loadProfessores } from '@/_lib/professoresData';
import { parseProfessoresParams } from '@/_lib/professoresList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.academiaProfessores,
};

interface ProfessoresPageProps {
  searchParams: Promise<{
    q?: string | string[];
    page?: string | string[];
  }>;
}

export default async function AcademiaProfessoresPage({
  searchParams,
}: ProfessoresPageProps) {
  await redirectUnlessAcademiaOwner();
  const params = parseProfessoresParams(await searchParams);
  const list = await loadProfessores(params);

  return (
    <DefaultLayout>
      {isLoadFailure(list) ? (
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar os professores. Tente novamente em alguns
          instantes.
        </p>
      ) : (
        <ProfessoresView list={list} search={params.search} />
      )}
    </DefaultLayout>
  );
}
