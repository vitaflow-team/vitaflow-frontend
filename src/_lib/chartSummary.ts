import type { ChartPoint } from '@/_types/chartPoint';
import type { TrendPoint } from '@/_types/progress';

export interface TrendSummaryPoint {
  t: number;
  value: number;
}

export interface TrendSummaryInput {
  /** Metric name as it appears in the sentence, for example `Peso`. */
  label: string;
  /** Unit as displayed, for example `kg`. Empty for BMI. */
  unit: string;
  weeks: number;
  points: TrendSummaryPoint[];
  format: (value: number) => string;
}

/** A real minus sign (U+2212), not the keyboard hyphen. */
const MINUS_SIGN = '−';

/** Appends the unit when there is one: `82,4 kg`, but a bare `24,1` for BMI. */
export function withUnit(text: string, unit: string): string {
  return unit ? `${text} ${unit}` : text;
}

/**
 * Plottable points in time order: timestamps parsed from `recordedAt`, and
 * any point with an unparseable date or a non-finite value dropped.
 */
export function toChartPoints(points: TrendPoint[]): ChartPoint[] {
  return points
    .map(point => ({ t: Date.parse(point.recordedAt), value: point.value }))
    .filter(point => Number.isFinite(point.t) && Number.isFinite(point.value))
    .sort((a, b) => a.t - b.t);
}

/**
 * Neutral sentence describing the series for whoever cannot see the chart
 * (ADR-003): first value, last value, signed change and the period. It never
 * judges the trend — no "melhora", "piora", "bom" or "ruim".
 */
export function buildTrendSummary(input: TrendSummaryInput): string {
  const { label, unit, weeks, points, format } = input;
  const period = `${weeks} semanas`;

  if (points.length === 0) {
    return `${label}: sem registros em ${period}.`;
  }

  if (points.length === 1) {
    return `${label}: um registro em ${period}, ${withUnit(
      format(points[0].value),
      unit
    )}.`;
  }

  const first = points[0].value;
  const last = points[points.length - 1].value;
  const from = withUnit(format(first), unit);
  const to = withUnit(format(last), unit);
  const opening = `${label} de ${from} para ${to} em ${period}`;

  const change = Math.round((last - first) * 10) / 10;
  if (change === 0) {
    return `${opening}, sem variação`;
  }

  const sign = change > 0 ? '+' : MINUS_SIGN;
  const magnitude = withUnit(format(Math.abs(change)), unit);
  return `${opening}, variação de ${sign}${magnitude}`;
}
