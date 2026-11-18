import { monthOptions, panelHref } from '@/_lib/financialHealthParams';
import { isLoadFailure } from '@/_lib/isLoadFailure';
import type { FinancialPanelQuery } from '@/_types/financialPanelQuery';
import type { LoadFailure } from '@/_types/loadFailure';
import type { PlatformSummary } from '@/_types/platformSummary';
import { MonthSelector } from './monthSelector';
import { PanelFailure } from './panelFailure';
import { PlatformSummaryBody } from './platformSummaryBody';

interface PlatformSummarySectionProps {
  /** `null` when the summary was not requested, which only happens outside the ADMIN tier. */
  summary: PlatformSummary | LoadFailure | null;
  path: string;
  query: FinancialPanelQuery;
  /** Today in Brasília as `YYYY-MM-DD`: bounds the month selector. */
  today: string;
}

/** The ADMIN-only part of the page: month selector, totals by account type and the overdue bands. */
export function PlatformSummarySection({
  summary,
  path,
  query,
  today,
}: PlatformSummarySectionProps) {
  if (summary === null) return null;

  return (
    <>
      <MonthSelector
        path={path}
        selected={query.month}
        options={monthOptions(today)}
      />
      {isLoadFailure(summary) ? (
        <PanelFailure
          failure={summary}
          what="o resumo financeiro"
          retryHref={panelHref(path, query)}
        />
      ) : (
        <PlatformSummaryBody summary={summary} />
      )}
    </>
  );
}
