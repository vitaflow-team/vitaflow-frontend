import DefaultLayout from '@/_components/layout/defaultLayout';
import { PatientHeader } from '@/_components/patients/patientHeader';
import { PatientNotFound } from '@/_components/patients/patientNotFound';
import { PatientTabs } from '@/_components/patients/patientTabs';
import { isLoadFailure, loadPatient } from '@/_lib/patientsData';
import { redirectUnlessNutritionist } from '@/_lib/patientsAuthorization';
import type { ReactNode } from 'react';

interface PatientLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function PatientLayout({
  children,
  params,
}: PatientLayoutProps) {
  await redirectUnlessNutritionist();
  const { id } = await params;
  const patient = await loadPatient(id);

  if (isLoadFailure(patient)) {
    return (
      <DefaultLayout>
        <PatientNotFound reason={patient} />
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <PatientHeader patient={patient} />
        <PatientTabs patientId={patient.id}>{children}</PatientTabs>
      </div>
    </DefaultLayout>
  );
}
