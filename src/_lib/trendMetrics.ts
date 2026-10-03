import { formatBmi } from '@/_lib/progressDisplay';
import type { TrendMetric } from '@/_types/trendMetric';
import type { TrendMetricConfig } from '@/_types/trendMetricConfig';

export const TREND_METRICS: Record<TrendMetric, TrendMetricConfig> = {
  weight: {
    label: 'Peso',
    unit: 'kg',
    color: 'var(--icon-accent)',
    axisWidth: 44,
    format: value =>
      value.toLocaleString('pt-BR', { maximumFractionDigits: 1 }),
  },
  bmi: {
    label: 'IMC',
    unit: '',
    color: 'var(--chart-3)',
    axisWidth: 44,
    format: formatBmi,
  },
};

const axisDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
});

const fullDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

/** Short `dd/mm` label for the time axis ticks. */
export function formatAxisDate(timestamp: number): string {
  return axisDateFormatter.format(timestamp);
}

/** Date and time of one point, used by the tooltip and the hidden table. */
export function formatFullDate(timestamp: number): string {
  return fullDateFormatter.format(timestamp);
}

const dayOnlyFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

/**
 * The date of one plotted point. A point an educator measured is a calendar
 * date, not a moment, so it shows no time of day; the user's own points keep
 * theirs.
 */
export function formatPointDate(point: {
  t: number;
  educatorName?: string;
}): string {
  return point.educatorName
    ? dayOnlyFormatter.format(point.t)
    : formatFullDate(point.t);
}
