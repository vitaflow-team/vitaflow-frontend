import {
  getTimeTicks,
  HEALTHY_BMI_MAX,
  HEALTHY_BMI_MIN,
  type NiceTicks,
} from '@/_lib/chartAxis';
import { formatAxisDate } from '@/_lib/trendMetrics';
import type { TrendMetricConfig } from '@/_types/trendMetricConfig';
import { CartesianGrid, ReferenceArea, XAxis, YAxis } from 'recharts';

interface TrendChartAxesProps {
  startMs: number;
  endMs: number;
  axis: NiceTicks;
  config: TrendMetricConfig;
  isBmi: boolean;
}

/**
 * Horizontal grid, a real time scale over the whole window (never
 * `Date.now()`), round value ticks and, on the BMI chart, the healthy band.
 */
export function TrendChartAxes({
  startMs,
  endMs,
  axis,
  config,
  isBmi,
}: TrendChartAxesProps) {
  return (
    <>
      <CartesianGrid
        vertical={false}
        stroke="var(--line)"
        strokeDasharray="3 3"
      />
      <XAxis
        dataKey="t"
        type="number"
        scale="time"
        domain={[startMs, endMs]}
        ticks={getTimeTicks(startMs, endMs)}
        tickFormatter={value => formatAxisDate(Number(value))}
        stroke="var(--muted-foreground)"
        tick={{ fontSize: 11 }}
        tickMargin={8}
      />
      <YAxis
        type="number"
        domain={[axis.min, axis.max]}
        ticks={axis.ticks}
        tickFormatter={value => config.format(Number(value))}
        stroke="var(--muted-foreground)"
        tick={{ fontSize: 11 }}
        width={config.axisWidth}
      />
      {isBmi && (
        <ReferenceArea
          y1={HEALTHY_BMI_MIN}
          y2={HEALTHY_BMI_MAX}
          fill="var(--sage-bg)"
          fillOpacity={1}
          stroke="none"
          ifOverflow="hidden"
        />
      )}
    </>
  );
}
