import { PatientOverviewCard } from '@/_components/patients/patientOverviewCard';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import {
  isLoadFailure,
  loadFormRecordHistory,
} from '@/_lib/clinicalRecordsData';
import {
  isLoadFailure as isMealPlanLoadFailure,
  loadVersions,
} from '@/_lib/mealPlanData';
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

  const [anamnese, assessments, versions] = await Promise.all([
    loadFormRecordHistory(patient.id, 'ANAMNESE'),
    loadFormRecordHistory(patient.id, 'ASSESSMENT'),
    loadVersions(patient.id),
  ]);

  const latestVersion =
    !isMealPlanLoadFailure(versions) && versions.length > 0
      ? versions[0]
      : null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <PatientOverviewCard
        patientId={patient.id}
        title="Anamnese"
        tab="anamnese"
        latestDate={
          isLoadFailure(anamnese) ? null : (anamnese[0]?.recordedAt ?? null)
        }
      />
      <PatientOverviewCard
        patientId={patient.id}
        title="Avaliação"
        tab="avaliacao"
        latestDate={
          isLoadFailure(assessments)
            ? null
            : (assessments[0]?.recordedAt ?? null)
        }
      />
      <PatientOverviewCard
        patientId={patient.id}
        title="Plano alimentar"
        tab="plano-alimentar"
        latestDate={latestVersion?.publishedAt ?? null}
        emptyMessage="Nenhuma versão publicada ainda."
        fillLabel="Montar plano"
      />
    </div>
  );
}
