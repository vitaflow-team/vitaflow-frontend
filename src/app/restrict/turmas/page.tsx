import DefaultLayout from '@/_components/layout/defaultLayout';
import { StudentTurmasView } from '@/_components/turmas/studentTurmasView';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { isLoadFailure, loadStudentTurmas } from '@/_lib/studentTurmasData';
import { redirectUnlessGymStudentAccount } from '@/_lib/studentTurmasAuthorization';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.studentTurmas,
};

export default async function StudentTurmasPage() {
  await redirectUnlessGymStudentAccount();
  const items = await loadStudentTurmas();

  return (
    <DefaultLayout>
      {isLoadFailure(items) ? (
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar as turmas. Tente novamente em alguns
          instantes.
        </p>
      ) : (
        <StudentTurmasView items={items} />
      )}
    </DefaultLayout>
  );
}
