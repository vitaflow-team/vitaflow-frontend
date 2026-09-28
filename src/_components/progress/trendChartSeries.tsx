import type { ChartPoint } from '@/_types/chartPoint';
import type { TrendMetricConfig } from '@/_types/trendMetricConfig';
import { Area, ReferenceDot } from 'recharts';

interface TrendChartGradientProps {
  id: string;
  color: string;
}

/** Vertical fade under the line, from 30% of the metric color to transparent. */
export function TrendChartGradient({ id, color }: TrendChartGradientProps) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

interface TrendChartSeriesProps {
  chartPoints: ChartPoint[];
  config: TrendMetricConfig;
  gradientId: string;
}

/**
 * The area series plus a larger marker on the last point. A single point has
 * no line or fill to draw, only its dot.
 */
export function TrendChartSeries({
  chartPoints,
  config,
  gradientId,
}: TrendChartSeriesProps) {
  const hasLine = chartPoints.length > 1;
  const lastPoint = chartPoints[chartPoints.length - 1];

  return (
    <>
      <Area
        type="monotone"
        dataKey="value"
        stroke={config.color}
        strokeWidth={hasLine ? 2.5 : 0}
        fill={`url(#${gradientId})`}
        fillOpacity={hasLine ? 1 : 0}
        dot={{
          fill: config.color,
          stroke: 'var(--card)',
          strokeWidth: 1,
          r: 3,
        }}
        activeDot={{ r: 5, fill: config.color, stroke: 'var(--card)' }}
        isAnimationActive={false}
      />
      <ReferenceDot
        x={lastPoint.t}
        y={lastPoint.value}
        r={5.5}
        fill={config.color}
        stroke="var(--card)"
        strokeWidth={2}
        ifOverflow="visible"
      />
    </>
  );
}
