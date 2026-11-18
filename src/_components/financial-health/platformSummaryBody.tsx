import { monthLabel } from '@/_lib/financialHealthParams';
import {
  formatSyncedAt,
  platformMonthChanges,
} from '@/_lib/platformFinancialDisplay';
import type { PlatformSummary } from '@/_types/platformSummary';
import { AgingBands } from './agingBands';
import { PanelNotice } from './panelNotice';
import { PlatformAccountBreakdown } from './platformAccountBreakdown';
import { SummaryTiles } from './summaryTiles';

interface PlatformSummaryBodyProps {
  summary: PlatformSummary;
}

function MonthFigures({ summary }: PlatformSummaryBodyProps) {
  const { totals, byAccountType } = summary;
  if (!summary.available || !totals || !byAccountType) {
    return (
      <PanelNotice
        message={`${monthLabel(summary.month)} está indisponível: a Vita Flow ainda não tinha pagamentos de assinatura registrados neste período.`}
      />
    );
  }

  return (
    <>
      <SummaryTiles
        monthLabel={monthLabel(summary.month)}
        current={totals}
        changes={platformMonthChanges(totals, summary.previous?.totals ?? null)}
      />
      <PlatformAccountBreakdown
        byAccountType={byAccountType}
        overdue={summary.overdue}
      />
    </>
  );
}

/** Month figures (or the unavailable-month notice), then today's overdue bands; the figures of a month never appear as zeros when unknown. */
export function PlatformSummaryBody({ summary }: PlatformSummaryBodyProps) {
  return (
    <>
      <MonthFigures summary={summary} />
      <AgingBands
        overdue={summary.overdue}
        noOverdueMessage="Nenhuma assinatura em atraso. Está tudo em dia."
      />
      {summary.syncedAt && (
        <p className="text-muted-foreground text-xs">
          Pagamentos sincronizados em {formatSyncedAt(summary.syncedAt)}.
        </p>
      )}
    </>
  );
}
