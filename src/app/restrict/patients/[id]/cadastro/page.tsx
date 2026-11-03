import { PAGE_TITLES } from '@/_constants/pageTitles';
import { isLoadFailure, loadPatient } from '@/_lib/patientsData';
import ClientView from '@/app/restrict/clients/[id]/clientView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.patientRegistration,
};

interface PatientRegistrationPageProps {
  params: Promise<{ id: string }>;
}

/** "Cadastro": the existing registration form, unchanged (US-013, ADR-004). */
export default async function PatientRegistrationPage({
  params,
}: PatientRegistrationPageProps) {
  const { id } = await params;
  const patient = await loadPatient(id);
  if (isLoadFailure(patient)) return null;

  return (
    <ClientView
      id={patient.id}
      backUrl={`/restrict/patients/${patient.id}/cadastro`}
    />
  );
}
