import DefaultLayout from '@/_components/layout/defaultLayout';
import { PatientsView } from '@/_components/patients/patientsView';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { isLoadFailure, loadPatients } from '@/_lib/patientsData';
import { parsePatientsParams } from '@/_lib/patientsList';
import { redirectUnlessNutritionist } from '@/_lib/patientsAuthorization';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.patients,
};

interface PatientsPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

export default async function PatientsPage({
  searchParams,
}: PatientsPageProps) {
  await redirectUnlessNutritionist();
  const { search } = parsePatientsParams(await searchParams);
  const list = await loadPatients(search);

  return (
    <DefaultLayout>
      {isLoadFailure(list) ? (
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar seus pacientes. Tente novamente em alguns
          instantes.
        </p>
      ) : (
        <PatientsView list={list} search={search} />
      )}
    </DefaultLayout>
  );
}
