import { AnamneseSection } from '@/_components/clinicalRecords/anamneseSection';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import {
  isLoadFailure,
  loadFormRecordHistory,
  loadTemplates,
} from '@/_lib/clinicalRecordsData';
import { EDUCATOR_CLINICAL_RECORDS_ACTIONS } from '@/_lib/educatorClinicalRecordsActions';
import {
  isLoadFailure as isStudentLoadFailure,
  loadStudent,
} from '@/_lib/studentsData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.student,
};

interface StudentAnamnesePageProps {
  params: Promise<{ id: string }>;
}

/** Anamnese, optional for the physical educator (US-022.AC-1). */
export default async function StudentAnamnesePage({
  params,
}: StudentAnamnesePageProps) {
  const { id } = await params;
  const student = await loadStudent(id);
  if (isStudentLoadFailure(student)) return null;

  const [templates, history] = await Promise.all([
    loadTemplates('ANAMNESE'),
    loadFormRecordHistory(student.id, 'ANAMNESE'),
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
      clientId={student.id}
      templates={templates}
      latest={history[0] ?? null}
      actions={EDUCATOR_CLINICAL_RECORDS_ACTIONS}
    />
  );
}
