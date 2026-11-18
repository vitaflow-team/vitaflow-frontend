import { DELINQUENTS_ANCHOR } from '@/_constants/financialHealth';
import { panelHref } from '@/_lib/financialHealthParams';
import { isLoadFailure } from '@/_lib/isLoadFailure';
import type { DelinquentsPage } from '@/_types/delinquentsPage';
import type { FinancialPanelCopy } from '@/_types/financialPanelCopy';
import type { FinancialPanelProfile } from '@/_types/financialPanelProfile';
import type { FinancialPanelQuery } from '@/_types/financialPanelQuery';
import type { LoadFailure } from '@/_types/loadFailure';
import { DelinquentList } from './delinquentList';
import { DelinquentsPagination } from './delinquentsPagination';
import { PanelFailure } from './panelFailure';

interface DelinquentsSectionProps {
  delinquents: DelinquentsPage | LoadFailure;
  profile: FinancialPanelProfile;
  copy: FinancialPanelCopy;
  path: string;
  query: FinancialPanelQuery;
}

/** The delinquent people, with their own failure state so the figures above survive it. */
export function DelinquentsSection({
  delinquents,
  profile,
  copy,
  path,
  query,
}: DelinquentsSectionProps) {
  return (
    <section
      id={DELINQUENTS_ANCHOR}
      aria-labelledby="financial-delinquents-heading"
      className="flex scroll-mt-4 flex-col gap-3"
    >
      <h2 id="financial-delinquents-heading" className="text-lg font-semibold">
        Inadimplentes
      </h2>
      <p className="text-muted-foreground text-sm">
        Lista de {copy.people} com ao menos uma cobrança em atraso, do maior
        valor devido para o menor. O total soma só o que está em atraso.
      </p>
      {isLoadFailure(delinquents) ? (
        <PanelFailure
          failure={delinquents}
          what="a lista de inadimplentes"
          retryHref={panelHref(path, query)}
        />
      ) : (
        <>
          <DelinquentList
            items={delinquents.items}
            profile={profile}
            copy={copy}
          />
          <DelinquentsPagination
            path={path}
            month={query.month}
            page={delinquents.page}
            total={delinquents.total}
            pageSize={delinquents.pageSize}
          />
        </>
      )}
    </section>
  );
}
