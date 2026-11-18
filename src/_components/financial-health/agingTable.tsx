import { formatBRL } from '@/_lib/financialHealthDisplay';
import type { FinancialOverdue } from '@/_types/financialOverdue';

interface AgingTableProps {
  overdue: FinancialOverdue;
}

const CELL = 'px-2 py-2 text-right tabular-nums';
const HEAD = 'px-2 py-2 text-left font-medium';

/** Overdue amount per band and in total, with column and row headers for screen readers. */
export function AgingTable({ overdue }: AgingTableProps) {
  const { bands } = overdue;
  const rows = [
    { label: '1–7 dias', cents: bands.d1to7Cents },
    { label: '8–30 dias', cents: bands.d8to30Cents },
    { label: '31+ dias', cents: bands.d31PlusCents },
  ];

  return (
    <table className="w-full text-sm">
      <caption className="sr-only">Valores em atraso por faixa de dias</caption>
      <thead>
        <tr className="border-b">
          <th scope="col" className={HEAD}>
            Faixa de atraso
          </th>
          <th scope="col" className={`${HEAD} text-right`}>
            Valor
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.label} className="border-b">
            <th scope="row" className={`${HEAD} font-normal`}>
              {row.label}
            </th>
            <td className={CELL}>{formatBRL(row.cents)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="font-semibold">
          <th scope="row" className={HEAD}>
            Total em atraso
          </th>
          <td className={CELL}>{formatBRL(overdue.totalCents)}</td>
        </tr>
      </tfoot>
    </table>
  );
}
