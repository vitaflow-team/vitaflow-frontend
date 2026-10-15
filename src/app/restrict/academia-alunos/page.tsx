import { ComingSoon } from '@/_components/layout/comingSoon';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { redirectUnlessAcademiaOwner } from '@/_lib/academiaAuthorization';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.academiaAlunos,
};

export default async function AcademiaAlunosPage() {
  await redirectUnlessAcademiaOwner();

  return (
    <DefaultLayout>
      <ComingSoon title="Alunos ainda não está disponível" />
    </DefaultLayout>
  );
}
