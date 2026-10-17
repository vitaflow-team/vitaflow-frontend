import { PatientOverviewCard } from '@/_components/patients/patientOverviewCard';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import {
  isLoadFailure,
  loadFormRecordHistory,
} from '@/_lib/clinicalRecordsData';
import { loadPatient } from '@/_lib/patientsData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.patient,
};

interface PatientOverviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientOverviewPage({
  params,
}: PatientOverviewPageProps) {
  const { id } = await params;
  const patient = await loadPatient(id);
  if (isLoadFailure(patient)) return null;

  const [anamnese, assessments] = await Promise.all([
    loadFormRecordHistory(patient.id, 'ANAMNESE'),
    loadFormRecordHistory(patient.id, 'ASSESSMENT'),
  ]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PatientOverviewCard
        patientId={patient.id}
        title="Anamnese"
        tab="anamnese"
        latest={isLoadFailure(anamnese) ? null : (anamnese[0] ?? null)}
      />
      <PatientOverviewCard
        patientId={patient.id}
        title="Avaliação"
        tab="avaliacao"
        latest={isLoadFailure(assessments) ? null : (assessments[0] ?? null)}
      />
    </div>
  );
}
