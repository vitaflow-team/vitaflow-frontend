import { AssessmentSection } from '@/_components/clinicalRecords/assessmentSection';
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

interface StudentAssessmentPageProps {
  params: Promise<{ id: string }>;
}

/** "Avaliação física": the same shared template/form-filling UI as the nutritionist (US-022/US-023). */
export default async function StudentAssessmentPage({
  params,
}: StudentAssessmentPageProps) {
  const { id } = await params;
  const student = await loadStudent(id);
  if (isStudentLoadFailure(student)) return null;

  const [templates, history] = await Promise.all([
    loadTemplates('ASSESSMENT'),
    loadFormRecordHistory(student.id, 'ASSESSMENT'),
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
      clientId={student.id}
      templates={templates}
      history={history}
      actions={EDUCATOR_CLINICAL_RECORDS_ACTIONS}
    />
  );
}
