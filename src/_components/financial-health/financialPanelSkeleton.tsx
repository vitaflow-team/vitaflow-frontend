import { Skeleton } from '@/_components/ui/skeleton';

const TILES = ['expected', 'received', 'still-owed'];
const ROWS = ['first', 'second', 'third'];

/** Placeholder shown while a panel loads; one skeleton for every financial route. */
export function FinancialPanelSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="flex flex-col gap-6"
    >
      <span className="sr-only">Carregando o painel financeiro…</span>
      <div className="flex flex-col gap-2" aria-hidden="true">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3" aria-hidden="true">
        {TILES.map(tile => (
          <Skeleton key={tile} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-32" aria-hidden="true" />
      <div className="flex flex-col gap-2" aria-hidden="true">
        {ROWS.map(row => (
          <Skeleton key={row} className="h-16" />
        ))}
      </div>
    </div>
  );
}
