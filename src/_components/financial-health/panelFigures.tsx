import { monthChanges } from '@/_lib/financialHealthDisplay';
import { monthLabel, monthOptions } from '@/_lib/financialHealthParams';
import type { DelinquentsPage } from '@/_types/delinquentsPage';
import type { FinancialHealthSummary } from '@/_types/financialHealthSummary';
import type { FinancialPanelCopy } from '@/_types/financialPanelCopy';
import type { FinancialPanelProfile } from '@/_types/financialPanelProfile';
import type { FinancialPanelQuery } from '@/_types/financialPanelQuery';
import type { LoadFailure } from '@/_types/loadFailure';
import { AgingBands } from './agingBands';
import { DelinquentsSection } from './delinquentsSection';
import { MonthSelector } from './monthSelector';
import { SummaryTiles } from './summaryTiles';

interface PanelFiguresProps {
  summary: FinancialHealthSummary;
  delinquents: DelinquentsPage | LoadFailure;
  profile: FinancialPanelProfile;
  copy: FinancialPanelCopy;
  path: string;
  query: FinancialPanelQuery;
  today: string;
}

/** Month selector, month summary, overdue bands and delinquent list, in that order (PRD, UI and UX). */
export function PanelFigures({
  summary,
  delinquents,
  profile,
  copy,
  path,
  query,
  today,
}: PanelFiguresProps) {
  return (
    <>
      <MonthSelector
        path={path}
        selected={summary.month}
        options={monthOptions(today)}
      />
      <SummaryTiles
        monthLabel={monthLabel(summary.month)}
        current={summary.current}
        changes={monthChanges(summary)}
      />
      <AgingBands overdue={summary.overdue} noOverdueMessage={copy.noOverdue} />
      <DelinquentsSection
        delinquents={delinquents}
        profile={profile}
        copy={copy}
        path={path}
        query={query}
      />
    </>
  );
}
