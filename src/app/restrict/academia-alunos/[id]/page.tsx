import { GymStudentBilling } from '@/_components/academia-alunos/gymStudentBilling';
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
import { loadStudentInvoices } from '@/_lib/billingData';
import { normalizePage } from '@/_lib/financialHealthParams';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.academiaAlunos,
};

interface AcademiaAlunoPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}

/** One gym student: the baseline assessment (assigned educator or not) and the monthly fees (ADR-005/US-025, US-016). */
export default async function AcademiaAlunoPage({
  params,
  searchParams,
}: AcademiaAlunoPageProps) {
  await redirectUnlessAcademiaOwner();
  const { id } = await params;
  const page = normalizePage((await searchParams).page);

  const [templates, history, invoices] = await Promise.all([
    loadAcademiaTemplatesForClient(id, 'ASSESSMENT'),
    loadAcademiaFormRecordHistory(id, 'ASSESSMENT'),
    loadStudentInvoices(id, page),
  ]);

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-8">
        {isLoadFailure(templates) || isLoadFailure(history) ? (
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar as avaliações. Tente novamente em alguns
            instantes.
          </p>
        ) : (
          <AssessmentSection
            clientId={id}
            templates={templates}
            history={history}
            actions={ACADEMIA_CLINICAL_RECORDS_ACTIONS}
          />
        )}
        <GymStudentBilling clientId={id} invoices={invoices} />
      </div>
    </DefaultLayout>
  );
}
