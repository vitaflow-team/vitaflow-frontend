import { formatBRL } from '@/_lib/financialHealthDisplay';
import type { FinancialMonthTotals } from '@/_types/financialMonthTotals';
import type { FinancialOverdue } from '@/_types/financialOverdue';
import { DelinquentFigure } from './delinquentFigure';

interface PlatformAccountCardProps {
  label: string;
  totals: FinancialMonthTotals;
  overdue: FinancialOverdue;
}

/** One account type: its month figures and today's overdue amount and delinquent count. */
export function PlatformAccountCard({
  label,
  totals,
  overdue,
}: PlatformAccountCardProps) {
  return (
    <li className="flex flex-col gap-2 rounded-lg border p-3">
      <h3 className="font-medium">{label}</h3>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-5">
        <DelinquentFigure
          label="Previsto"
          value={formatBRL(totals.expectedCents)}
        />
        <DelinquentFigure
          label="Recebido"
          value={formatBRL(totals.receivedCents)}
        />
        <DelinquentFigure
          label="Falta receber"
          value={formatBRL(totals.stillOwedCents)}
        />
        <DelinquentFigure
          label="Em atraso hoje"
          value={formatBRL(overdue.totalCents)}
        />
        <DelinquentFigure
          label="Inadimplentes"
          value={String(overdue.delinquentCount)}
        />
      </dl>
    </li>
  );
}
