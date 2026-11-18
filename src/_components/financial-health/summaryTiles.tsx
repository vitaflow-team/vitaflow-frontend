import { formatBRL } from '@/_lib/financialHealthDisplay';
import type { FinancialMonthChanges } from '@/_types/financialMonthChanges';
import type { FinancialMonthTotals } from '@/_types/financialMonthTotals';
import { SummaryTile } from './summaryTile';

interface SummaryTilesProps {
  monthLabel: string;
  current: FinancialMonthTotals;
  changes: FinancialMonthChanges;
}

/** Expected, received and still owed for the month, each against the month before (ADR-004). */
export function SummaryTiles({
  monthLabel,
  current,
  changes,
}: SummaryTilesProps) {
  return (
    <section
      aria-labelledby="financial-summary-heading"
      className="flex flex-col gap-3"
    >
      <h2 id="financial-summary-heading" className="text-lg font-semibold">
        Resumo de {monthLabel}
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryTile
          id="financial-expected"
          label="Previsto"
          hint="Cobranças com vencimento neste mês."
          value={formatBRL(current.expectedCents)}
          change={changes.expected}
        />
        <SummaryTile
          id="financial-received"
          label="Recebido"
          hint="Pago neste mês, pela data do pagamento."
          value={formatBRL(current.receivedCents)}
          change={changes.received}
        />
        <SummaryTile
          id="financial-still-owed"
          label="Falta receber"
          hint="Em aberto entre as cobranças que vencem neste mês."
          value={formatBRL(current.stillOwedCents)}
          change={changes.stillOwed}
        />
      </div>
    </section>
  );
}
