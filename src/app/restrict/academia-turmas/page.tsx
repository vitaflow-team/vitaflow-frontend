import DefaultLayout from '@/_components/layout/defaultLayout';
import { AcademiaTurmasView } from '@/_components/academia-turmas/academiaTurmasView';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { redirectUnlessAcademiaOwner } from '@/_lib/academiaAuthorization';
import { isLoadFailure, loadTurmas } from '@/_lib/turmasData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.academiaTurmas,
};

export default async function AcademiaTurmasPage() {
  await redirectUnlessAcademiaOwner();
  const data = await loadTurmas();

  return (
    <DefaultLayout>
      {isLoadFailure(data) ? (
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar as turmas. Tente novamente em alguns
          instantes.
        </p>
      ) : (
        <AcademiaTurmasView
          turmas={data.turmas}
          employments={data.employments}
        />
      )}
    </DefaultLayout>
  );
}
