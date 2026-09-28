import { HEALTHY_BMI_MAX, HEALTHY_BMI_MIN } from '@/_lib/chartAxis';
import { withUnit } from '@/_lib/chartSummary';
import { formatBmi } from '@/_lib/progressDisplay';
import { formatFullDate } from '@/_lib/trendMetrics';
import type { ChartPoint } from '@/_types/chartPoint';
import type { TrendMetricConfig } from '@/_types/trendMetricConfig';

/**
 * Healthy band label drawn in HTML, outside the plot area, so it can never
 * cover the line or the axis labels on narrow screens.
 */
export function TrendChartBandLabel() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: 'var(--sage-bg)', color: 'var(--sage)' }}
    >
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: 'var(--sage)' }}
      />
      {`Peso normal · ${formatBmi(HEALTHY_BMI_MIN)} – ${formatBmi(HEALTHY_BMI_MAX)}`}
    </span>
  );
}

interface TrendChartEmptyStateProps {
  summary: string;
  weeks: number;
}

/**
 * Empty period: the same neutral summary as the `aria-label`, now as visible
 * text, instead of a table with no rows (ADR-003).
 */
export function TrendChartEmptyState({
  summary,
  weeks,
}: TrendChartEmptyStateProps) {
  return (
    <p className="text-muted-foreground flex h-40 items-center justify-center px-4 text-center text-sm md:h-56">
      {summary}
      {weeks < 12
        ? ' Escolha um período maior para ver registros mais antigos.'
        : ''}
    </p>
  );
}

interface TrendChartTableProps {
  title: string;
  weeks: number;
  config: TrendMetricConfig;
  chartPoints: ChartPoint[];
}

/** Screen-reader table built from the same points as the drawing (ADR-003). */
export function TrendChartTable({
  title,
  weeks,
  config,
  chartPoints,
}: TrendChartTableProps) {
  return (
    <table className="sr-only">
      <caption>{`${title} — registros das últimas ${weeks} semanas`}</caption>
      <thead>
        <tr>
          <th scope="col">Data</th>
          <th scope="col">{config.label}</th>
        </tr>
      </thead>
      <tbody>
        {chartPoints.map((point, index) => (
          <tr key={`${point.t}-${index}`}>
            <td>{formatFullDate(point.t)}</td>
            <td>{withUnit(config.format(point.value), config.unit)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
