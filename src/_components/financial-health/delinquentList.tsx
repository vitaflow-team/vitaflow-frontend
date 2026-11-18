import { personBillingHref } from '@/_lib/financialPanelCopy';
import type { DelinquentRow as DelinquentRowData } from '@/_types/delinquentRow';
import type { FinancialPanelCopy } from '@/_types/financialPanelCopy';
import type { FinancialPanelProfile } from '@/_types/financialPanelProfile';
import { DelinquentRow } from './delinquentRow';

interface DelinquentListProps {
  items: DelinquentRowData[];
  profile: FinancialPanelProfile;
  copy: FinancialPanelCopy;
}

/** One row per delinquent person, worst first; an empty list is good news, not an error. */
export function DelinquentList({ items, profile, copy }: DelinquentListProps) {
  if (items.length === 0) {
    return <p className="text-sm">{copy.emptyDelinquents}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map(row => (
        <DelinquentRow
          key={row.clientId}
          row={row}
          href={personBillingHref(profile, row.clientId)}
          overdueColumn={copy.overdueColumn}
        />
      ))}
    </ul>
  );
}
