import { isPlatformFailure } from '@/_lib/isPlatformFailure';
import { platformIntro } from '@/_lib/platformFinancialDisplay';
import type { FinancialPanelQuery } from '@/_types/financialPanelQuery';
import type { PlatformFinancialData } from '@/_types/platformFinancialData';
import { PlatformBandCounts } from './platformBandCounts';
import { PlatformDelinquentsFailure } from './platformDelinquentsFailure';
import { PlatformDelinquentsSection } from './platformDelinquentsSection';
import { PlatformSummarySection } from './platformSummarySection';

interface PlatformFinancialPanelProps {
  path: string;
  query: FinancialPanelQuery;
  /** Today in Brasília as `YYYY-MM-DD`: bounds the month selector. */
  today: string;
  data: PlatformFinancialData;
}

/**
 * The Vitaflow team's panel (ADR-003, ADR-010). The tier comes from the list:
 * ADMIN also gets the totals, EQUIPE only the list and the counts per band.
 */
export function PlatformFinancialPanel({
  path,
  query,
  today,
  data,
}: PlatformFinancialPanelProps) {
  const { delinquents, summary } = data;
  const tier = isPlatformFailure(delinquents) ? null : delinquents.tier;

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Saúde financeira da plataforma
        </h1>
        <p className="text-muted-foreground text-sm">{platformIntro(tier)}</p>
      </div>
      {tier === 'ADMIN' && (
        <PlatformSummarySection
          summary={summary}
          path={path}
          query={query}
          today={today}
        />
      )}
      {isPlatformFailure(delinquents) ? (
        <PlatformDelinquentsFailure
          failure={delinquents}
          path={path}
          query={query}
        />
      ) : (
        <>
          <PlatformBandCounts counts={delinquents.bandCounts} />
          <PlatformDelinquentsSection
            delinquents={delinquents}
            path={path}
            query={query}
          />
        </>
      )}
    </div>
  );
}
