import { ComingSoon } from '@/_components/layout/comingSoon';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { redirectUnlessAcademiaOwner } from '@/_lib/academiaAuthorization';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.academiaTurmas,
};

export default async function AcademiaTurmasPage() {
  await redirectUnlessAcademiaOwner();

  return (
    <DefaultLayout>
      <ComingSoon title="Turmas ainda não está disponível" />
    </DefaultLayout>
  );
}
