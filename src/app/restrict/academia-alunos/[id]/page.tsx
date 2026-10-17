import { AssessmentSection } from '@/_components/clinicalRecords/assessmentSection';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { ACADEMIA_CLINICAL_RECORDS_ACTIONS } from '@/_lib/academiaClinicalRecordsActions';
import {
  isLoadFailure,
  loadAcademiaFormRecordHistory,
  loadAcademiaTemplatesForClient,
} from '@/_lib/academiaClinicalRecordsData';
import { redirectUnlessAcademiaOwner } from '@/_lib/academiaAuthorization';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.academiaAlunos,
};

interface AcademiaAlunoPageProps {
  params: Promise<{ id: string }>;
}

/** Record a baseline assessment directly, assigned educator or not (ADR-005/US-025). */
export default async function AcademiaAlunoPage({
  params,
}: AcademiaAlunoPageProps) {
  await redirectUnlessAcademiaOwner();
  const { id } = await params;

  const [templates, history] = await Promise.all([
    loadAcademiaTemplatesForClient(id, 'ASSESSMENT'),
    loadAcademiaFormRecordHistory(id, 'ASSESSMENT'),
  ]);

  if (isLoadFailure(templates) || isLoadFailure(history)) {
    return (
      <DefaultLayout>
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar as avaliações. Tente novamente em alguns
          instantes.
        </p>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <AssessmentSection
        clientId={id}
        templates={templates}
        history={history}
        actions={ACADEMIA_CLINICAL_RECORDS_ACTIONS}
      />
    </DefaultLayout>
  );
}
