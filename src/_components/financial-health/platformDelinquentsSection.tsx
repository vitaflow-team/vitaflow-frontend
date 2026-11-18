import { DELINQUENTS_ANCHOR } from '@/_constants/financialHealth';
import type { FinancialPanelQuery } from '@/_types/financialPanelQuery';
import type { PlatformDelinquentsPage } from '@/_types/platformDelinquentsPage';
import { DelinquentsPagination } from './delinquentsPagination';
import { PlatformDelinquentList } from './platformDelinquentList';

interface PlatformDelinquentsSectionProps {
  delinquents: PlatformDelinquentsPage;
  path: string;
  query: FinancialPanelQuery;
}

/** The delinquent subscribers, 20 per page; opening a page is recorded by the backend (ADR-010). */
export function PlatformDelinquentsSection({
  delinquents,
  path,
  query,
}: PlatformDelinquentsSectionProps) {
  return (
    <section
      id={DELINQUENTS_ANCHOR}
      aria-labelledby="platform-delinquents-heading"
      className="flex scroll-mt-4 flex-col gap-3"
    >
      <h2 id="platform-delinquents-heading" className="text-lg font-semibold">
        Assinantes inadimplentes
      </h2>
      <p className="text-muted-foreground text-sm">
        Um assinante por linha, do maior valor devido para o menor. O total soma
        só o que está em atraso.
      </p>
      <PlatformDelinquentList items={delinquents.items} />
      <DelinquentsPagination
        path={path}
        month={query.month}
        page={delinquents.page}
        total={delinquents.total}
        pageSize={delinquents.pageSize}
      />
    </section>
  );
}
