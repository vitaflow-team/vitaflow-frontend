import { formatBRL, formatDays } from '@/_lib/financialHealthDisplay';
import type { DelinquentRow as DelinquentRowData } from '@/_types/delinquentRow';
import Link from 'next/link';

interface DelinquentRowProps {
  row: DelinquentRowData;
  href: string;
  overdueColumn: string;
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="font-semibold tabular-nums break-words">{value}</dd>
    </div>
  );
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
        <Figure label="Total devido" value={formatBRL(row.totalOwedCents)} />
        <Figure label={overdueColumn} value={String(row.overdueCount)} />
        <Figure
          label="Atraso mais antigo"
          value={formatDays(row.oldestDaysOverdue)}
        />
      </dl>
    </li>
  );
}
