import { bandCountRows } from '@/_lib/platformFinancialDisplay';
import type { PlatformBandCounts as PlatformBandCountsData } from '@/_types/platformBandCounts';

interface PlatformBandCountsProps {
  counts: PlatformBandCountsData;
}

const HEAD = 'px-2 py-2 text-left font-medium';
const CELL = 'px-2 py-2 text-right tabular-nums';

/** How many subscribers are delinquent in each band of days overdue; counts only, for both tiers. */
export function PlatformBandCounts({ counts }: PlatformBandCountsProps) {
  const { rows, total } = bandCountRows(counts);

  return (
    <section
      aria-labelledby="platform-bands-heading"
      className="flex flex-col gap-2"
    >
      <h2 id="platform-bands-heading" className="text-lg font-semibold">
        Inadimplentes por faixa de atraso
      </h2>
      <p className="text-muted-foreground text-sm">
        Situação de hoje, pelo atraso mais antigo de cada assinante.
      </p>
      <table className="w-full text-sm">
        <caption className="sr-only">
          Assinantes inadimplentes por faixa de dias em atraso
        </caption>
        <thead>
          <tr className="border-b">
            <th scope="col" className={HEAD}>
              Faixa de atraso
            </th>
            <th scope="col" className={`${HEAD} text-right`}>
              Assinantes
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.label} className="border-b">
              <th scope="row" className={`${HEAD} font-normal`}>
                {row.label}
              </th>
              <td className={CELL}>{row.count}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-semibold">
            <th scope="row" className={HEAD}>
              Total
            </th>
            <td className={CELL}>{total}</td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}
