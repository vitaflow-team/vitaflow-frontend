import { FinancialPanel } from '@/_components/financial-health/financialPanel';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { FINANCIAL_PANEL_PATHS } from '@/_constants/financialHealth';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { redirectUnlessProfessional } from '@/_lib/billingAuthorization';
import { loadFinancialPanel } from '@/_lib/financialHealthData';
import { resolvePanelQuery } from '@/_lib/financialHealthParams';
import { professionalProfileOf } from '@/_lib/financialPanelCopy';
import { redirectToSignIn } from '@/_lib/signInRedirect';
import { todayInBrazil } from '@/_lib/studentsDates';
import type { FinancialSearchParams } from '@/_types/financialSearchParams';
import { auth } from '@/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.financial,
};

interface FinanceiroPageProps {
  searchParams: Promise<FinancialSearchParams>;
}

/** Financial health of an independent educator or nutritionist (ADR-001). */
export default async function FinanceiroPage({
  searchParams,
}: FinanceiroPageProps) {
  const session = await auth();
  if (!session?.user) redirectToSignIn(FINANCIAL_PANEL_PATHS.PROFESSIONAL);
  await redirectUnlessProfessional();

  const today = todayInBrazil();
  const query = resolvePanelQuery(await searchParams, today);
  const data = await loadFinancialPanel(query);

  return (
    <DefaultLayout>
      <FinancialPanel
        profile={professionalProfileOf(session.user.productType)}
        path={FINANCIAL_PANEL_PATHS.PROFESSIONAL}
        query={query}
        today={today}
        data={data}
      />
    </DefaultLayout>
  );
}
