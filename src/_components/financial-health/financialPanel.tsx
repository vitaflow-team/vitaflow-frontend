import { Title } from '@/_components/ui/title';
import { panelHref } from '@/_lib/financialHealthParams';
import { panelCopy } from '@/_lib/financialPanelCopy';
import { isLoadFailure } from '@/_lib/isLoadFailure';
import type { FinancialPanelData } from '@/_types/financialPanelData';
import type { FinancialPanelProfile } from '@/_types/financialPanelProfile';
import type { FinancialPanelQuery } from '@/_types/financialPanelQuery';
import { PanelFailure } from './panelFailure';
import { PanelFigures } from './panelFigures';
import { PanelState } from './panelState';

interface FinancialPanelProps {
  profile: FinancialPanelProfile;
  path: string;
  query: FinancialPanelQuery;
  /** Today in Brasília as `YYYY-MM-DD`: bounds the month selector. */
  today: string;
  data: FinancialPanelData;
}

/** A whole financial panel, shared by the professional and the gym page. */
export function FinancialPanel({
  profile,
  path,
  query,
  today,
  data,
}: FinancialPanelProps) {
  const copy = panelCopy(profile);
  const { summary, delinquents, canBill } = data;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Title label={copy.title} className="text-left" />
        <p className="text-muted-foreground text-sm">{copy.intro}</p>
      </div>
      {isLoadFailure(summary) ? (
        <PanelFailure
          failure={summary}
          what="o painel financeiro"
          retryHref={panelHref(path, query)}
        />
      ) : (
        <PanelState summary={summary} canBill={canBill} copy={copy}>
          <PanelFigures
            summary={summary}
            delinquents={delinquents}
            profile={profile}
            copy={copy}
            path={path}
            query={query}
            today={today}
          />
        </PanelState>
      )}
    </div>
  );
}
