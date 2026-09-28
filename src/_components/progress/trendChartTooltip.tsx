import { withUnit } from '@/_lib/chartSummary';
import { formatFullDate } from '@/_lib/trendMetrics';
import type { ChartPoint } from '@/_types/chartPoint';
import type { TrendMetricConfig } from '@/_types/trendMetricConfig';

interface TrendTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: ChartPoint }>;
  config: TrendMetricConfig;
}

/** Dark bubble (primary/foreground tokens) with the point's value and date. */
export function TrendTooltip({ active, payload, config }: TrendTooltipProps) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;

  return (
    <div className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold">
        {withUnit(config.format(point.value), config.unit)}
      </p>
      <p className="opacity-80">{formatFullDate(point.t)}</p>
    </div>
  );
}
