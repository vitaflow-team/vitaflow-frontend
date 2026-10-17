import { AssessmentSection } from '@/_components/clinicalRecords/assessmentSection';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import {
  isLoadFailure,
  loadFormRecordHistory,
  loadTemplates,
} from '@/_lib/clinicalRecordsData';
import { loadPatient } from '@/_lib/patientsData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.patientAssessment,
};

interface PatientAssessmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientAssessmentPage({
  params,
}: PatientAssessmentPageProps) {
  const { id } = await params;
  const patient = await loadPatient(id);
  if (isLoadFailure(patient)) return null;

  const [templates, history] = await Promise.all([
    loadTemplates('ASSESSMENT'),
    loadFormRecordHistory(patient.id, 'ASSESSMENT'),
  ]);

  if (isLoadFailure(templates) || isLoadFailure(history)) {
    return (
      <p className="text-sm text-muted-foreground">
        Não foi possível carregar as avaliações. Tente novamente em alguns
        instantes.
      </p>
    );
  }

  return (
    <AssessmentSection
      clientId={patient.id}
      templates={templates}
      history={history}
    />
  );
}
