import { AnamneseSection } from '@/_components/clinicalRecords/anamneseSection';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import {
  isLoadFailure,
  loadFormRecordHistory,
  loadTemplates,
} from '@/_lib/clinicalRecordsData';
import { NUTRITIONIST_CLINICAL_RECORDS_ACTIONS } from '@/_lib/nutritionistClinicalRecordsActions';
import { loadPatient } from '@/_lib/patientsData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.patientAnamnese,
};

interface PatientAnamnesePageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientAnamnesePage({
  params,
}: PatientAnamnesePageProps) {
  const { id } = await params;
  const patient = await loadPatient(id);
  if (isLoadFailure(patient)) return null;

  const [templates, history] = await Promise.all([
    loadTemplates('ANAMNESE'),
    loadFormRecordHistory(patient.id, 'ANAMNESE'),
  ]);

  if (isLoadFailure(templates) || isLoadFailure(history)) {
    return (
      <p className="text-sm text-muted-foreground">
        Não foi possível carregar a anamnese. Tente novamente em alguns
        instantes.
      </p>
    );
  }

  return (
    <AnamneseSection
      clientId={patient.id}
      templates={templates}
      latest={history[0] ?? null}
      actions={NUTRITIONIST_CLINICAL_RECORDS_ACTIONS}
    />
  );
}
