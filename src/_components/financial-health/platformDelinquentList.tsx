import type { PlatformDelinquentRow as PlatformDelinquentRowData } from '@/_types/platformDelinquentRow';
import { PlatformDelinquentRow } from './platformDelinquentRow';

interface PlatformDelinquentListProps {
  items: PlatformDelinquentRowData[];
}

/** One row per delinquent subscriber, worst first; an empty list is good news, not an error. */
export function PlatformDelinquentList({ items }: PlatformDelinquentListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm">
        Nenhum assinante inadimplente. Está tudo em dia.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map(row => (
        <PlatformDelinquentRow key={row.userId} row={row} />
      ))}
    </ul>
  );
}
