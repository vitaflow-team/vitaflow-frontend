import DefaultLayout from '@/_components/layout/defaultLayout';
import { PatientsView } from '@/_components/patients/patientsView';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { isLoadFailure, loadPatients } from '@/_lib/patientsData';
import { parsePatientsParams } from '@/_lib/patientsList';
import { redirectUnlessNutritionist } from '@/_lib/patientsAuthorization';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: PAGE_TITLES.patientsList,
};

interface PatientsListPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

/**
 * "Pacientes" (lista completa): unchanged behavior from before the portfolio
 * dashboard became the default landing view at `/restrict/patients`
 * (ADR-007) — only its URL moved, so it stays reachable via the dashboard's
 * own link.
 */
export default async function PatientsListPage({
  searchParams,
}: PatientsListPageProps) {
  await redirectUnlessNutritionist();
  const { search } = parsePatientsParams(await searchParams);
  const list = await loadPatients(search);

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <Link
          href="/restrict/patients"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          ← Voltar ao painel
        </Link>
        {isLoadFailure(list) ? (
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar seus pacientes. Tente novamente em alguns
            instantes.
          </p>
        ) : (
          <PatientsView list={list} search={search} />
        )}
      </div>
    </DefaultLayout>
  );
}
