import type { FinancialOverdue } from '@/_types/financialOverdue';
import { AgingTable } from './agingTable';

interface AgingBandsProps {
  overdue: FinancialOverdue;
  /** Shown instead of a bare zero when nothing is overdue. */
  noOverdueMessage: string;
}

/** The current overdue situation by days past the due date (ADR-004): 1–7, 8–30 and 31+. */
export function AgingBands({ overdue, noOverdueMessage }: AgingBandsProps) {
  return (
    <section
      aria-labelledby="financial-overdue-heading"
      className="flex flex-col gap-2"
    >
      <h2 id="financial-overdue-heading" className="text-lg font-semibold">
        Em atraso hoje
      </h2>
      <p className="text-muted-foreground text-sm">
        Situação atual, vale para qualquer mês escolhido. Em atraso é a cobrança
        em aberto com vencimento antes de hoje.
      </p>
      <AgingTable overdue={overdue} />
      <p className="text-sm">
        {overdue.totalCents === 0
          ? noOverdueMessage
          : `Inadimplentes: ${overdue.delinquentCount}`}
      </p>
    </section>
  );
}
