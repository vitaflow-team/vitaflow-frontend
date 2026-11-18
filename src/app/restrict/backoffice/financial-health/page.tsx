import { PlatformFinancialPanel } from '@/_components/financial-health/platformFinancialPanel';
import { PLATFORM_FINANCIAL_PATH } from '@/_constants/financialHealth';
import { redirectUnlessBackoffice } from '@/_lib/backofficeAuthorization';
import { resolvePanelQuery } from '@/_lib/financialHealthParams';
import { loadPlatformFinancialPanel } from '@/_lib/platformFinancialHealth';
import { todayInBrazil } from '@/_lib/studentsDates';
import type { FinancialSearchParams } from '@/_types/financialSearchParams';

interface BackofficeFinancialHealthPageProps {
  searchParams: Promise<FinancialSearchParams>;
}

/** Subscription health of the platform for the Vitaflow team, shaped by the caller's tier (ADR-003, ADR-010). */
export default async function BackofficeFinancialHealthPage({
  searchParams,
}: BackofficeFinancialHealthPageProps) {
  await redirectUnlessBackoffice();

  const today = todayInBrazil();
  const query = resolvePanelQuery(await searchParams, today);
  const data = await loadPlatformFinancialPanel(query);

  return (
    <PlatformFinancialPanel
      path={PLATFORM_FINANCIAL_PATH}
      query={query}
      today={today}
      data={data}
    />
  );
}
