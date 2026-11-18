import { FinancialPanel } from '@/_components/financial-health/financialPanel';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { FINANCIAL_PANEL_PATHS } from '@/_constants/financialHealth';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { redirectUnlessAcademiaOwner } from '@/_lib/academiaAuthorization';
import { loadFinancialPanel } from '@/_lib/financialHealthData';
import { resolvePanelQuery } from '@/_lib/financialHealthParams';
import { redirectToSignIn } from '@/_lib/signInRedirect';
import { todayInBrazil } from '@/_lib/studentsDates';
import type { FinancialSearchParams } from '@/_types/financialSearchParams';
import { auth } from '@/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.academiaFinancial,
};

interface AcademiaFinanceiroPageProps {
  searchParams: Promise<FinancialSearchParams>;
}

/** Financial health of the gym, visible to its owner only (ADR-005). */
export default async function AcademiaFinanceiroPage({
  searchParams,
}: AcademiaFinanceiroPageProps) {
  const session = await auth();
  if (!session?.user) redirectToSignIn(FINANCIAL_PANEL_PATHS.GYM);
  await redirectUnlessAcademiaOwner();

  const today = todayInBrazil();
  const query = resolvePanelQuery(await searchParams, today);
  const data = await loadFinancialPanel(query);

  return (
    <DefaultLayout>
      <FinancialPanel
        profile="ACADEMIA"
        path={FINANCIAL_PANEL_PATHS.GYM}
        query={query}
        today={today}
        data={data}
      />
    </DefaultLayout>
  );
}
