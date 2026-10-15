import { ComingSoon } from '@/_components/layout/comingSoon';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { redirectUnlessAcademiaOwner } from '@/_lib/academiaAuthorization';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.academiaProfessores,
};

export default async function AcademiaProfessoresPage() {
  await redirectUnlessAcademiaOwner();

  return (
    <DefaultLayout>
      <ComingSoon title="Professores ainda não está disponível" />
    </DefaultLayout>
  );
}
