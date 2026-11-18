import { formatBRL, formatDays } from '@/_lib/financialHealthDisplay';
import { accountDirectoryHref } from '@/_lib/platformFinancialDisplay';
import { ROLE_LABELS } from '@/_lib/platformMetricsDisplay';
import type { PlatformDelinquentRow as PlatformDelinquentRowData } from '@/_types/platformDelinquentRow';
import Link from 'next/link';
import { DelinquentFigure } from './delinquentFigure';

interface PlatformDelinquentRowProps {
  row: PlatformDelinquentRowData;
}

/** One delinquent subscriber: name (the link to their directory entry), account type, plan, amount owed and days overdue. */
export function PlatformDelinquentRow({ row }: PlatformDelinquentRowProps) {
  return (
    <li className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col">
        <Link
          href={accountDirectoryHref(row.name)}
          title={row.name}
          className="text-primary min-w-0 truncate font-medium underline underline-offset-4 hover:no-underline"
        >
          {row.name}
        </Link>
        <span className="text-muted-foreground truncate text-xs">
          {ROLE_LABELS[row.accountType]} · {row.planName}
        </span>
      </div>
      <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <DelinquentFigure
          label="Total devido"
          value={formatBRL(row.totalOwedCents)}
        />
        <DelinquentFigure
          label="Atraso mais antigo"
          value={formatDays(row.oldestDaysOverdue)}
        />
      </dl>
    </li>
  );
}
