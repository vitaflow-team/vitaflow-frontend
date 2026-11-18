import { formatBRL, formatDays } from '@/_lib/financialHealthDisplay';
import type { DelinquentRow as DelinquentRowData } from '@/_types/delinquentRow';
import Link from 'next/link';
import { DelinquentFigure } from './delinquentFigure';

interface DelinquentRowProps {
  row: DelinquentRowData;
  href: string;
  overdueColumn: string;
}

/** One delinquent person: the name is the single link to their billing area. */
export function DelinquentRow({
  row,
  href,
  overdueColumn,
}: DelinquentRowProps) {
  return (
    <li className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href={href}
        title={row.name}
        className="text-primary min-w-0 truncate font-medium underline underline-offset-4 hover:no-underline"
      >
        {row.name}
      </Link>
      <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <DelinquentFigure
          label="Total devido"
          value={formatBRL(row.totalOwedCents)}
        />
        <DelinquentFigure
          label={overdueColumn}
          value={String(row.overdueCount)}
        />
        <DelinquentFigure
          label="Atraso mais antigo"
          value={formatDays(row.oldestDaysOverdue)}
        />
      </dl>
    </li>
  );
}
