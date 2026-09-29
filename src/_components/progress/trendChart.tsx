'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { getValueAxis } from '@/_lib/chartAxis';
import { buildTrendSummary, toChartPoints } from '@/_lib/chartSummary';
import { TREND_METRICS } from '@/_lib/trendMetrics';
import type { ChartPoint } from '@/_types/chartPoint';
import type { TrendPoint } from '@/_types/progress';
import type { TrendMetric } from '@/_types/trendMetric';
import type { TrendMetricConfig } from '@/_types/trendMetricConfig';
import { useId } from 'react';
import { AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendChartAxes } from './trendChartAxes';
import {
  TrendChartBandLabel,
  TrendChartEmptyState,
  TrendChartTable,
} from './trendChartDetails';
import { TrendChartGradient, TrendChartSeries } from './trendChartSeries';
import { TrendTooltip } from './trendChartTooltip';

interface TrendChartProps {
  title: string;
  points: TrendPoint[];
  period: { weeks: number; start: string; end: string };
  metric: TrendMetric;
}

/**
 * Generic area chart for both metrics (ADR-007). The horizontal axis is a real
 * time scale covering the whole window given by the response — never
 * `Date.now()` — and the vertical axis uses plain round ticks. The drawing sits
 * inside a `role="img"` with a text summary, and the hidden table right below
 * is built from the same array, so it can never disagree with it (ADR-003).
 */
export function TrendChart({ title, points, period, metric }: TrendChartProps) {
  const gradientId = useId();
  const config = TREND_METRICS[metric];
  const chartPoints = toChartPoints(points);
  const summary = buildTrendSummary({
    label: config.label,
    unit: config.unit,
    weeks: period.weeks,
    points: chartPoints,
    format: config.format,
  });
  const isBmi = metric === 'bmi';

  return (
    <Card className="min-w-0">
      <CardHeader className="flex flex-wrap items-center justify-between gap-2">
        <CardTitle>{title}</CardTitle>
        {isBmi && chartPoints.length > 0 && <TrendChartBandLabel />}
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        {chartPoints.length === 0 ? (
          <TrendChartEmptyState summary={summary} weeks={period.weeks} />
        ) : (
          <>
            <div role="img" aria-label={summary} className="h-52 md:h-72">
              <TrendChartDrawing
                chartPoints={chartPoints}
                config={config}
                gradientId={gradientId}
                isBmi={isBmi}
                startMs={Date.parse(period.start)}
                endMs={Date.parse(period.end)}
              />
            </div>
            <TrendChartTable
              title={title}
              weeks={period.weeks}
              config={config}
              chartPoints={chartPoints}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface TrendChartDrawingProps {
  chartPoints: ChartPoint[];
  config: TrendMetricConfig;
  gradientId: string;
  isBmi: boolean;
  startMs: number;
  endMs: number;
}

/** The Recharts surface: gradient, axes, tooltip and series, in drawing order. */
export function TrendChartDrawing({
  chartPoints,
  config,
  gradientId,
  isBmi,
  startMs,
  endMs,
}: TrendChartDrawingProps) {
  const axis = getValueAxis(
    chartPoints.map(point => point.value),
    isBmi
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartPoints}
        margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
        accessibilityLayer={false}
      >
        <TrendChartGradient id={gradientId} color={config.color} />
        <TrendChartAxes
          startMs={startMs}
          endMs={endMs}
          axis={axis}
          config={config}
          isBmi={isBmi}
        />
        <Tooltip
          content={<TrendTooltip config={config} />}
          cursor={{ stroke: 'var(--muted-foreground)', strokeDasharray: '3 3' }}
        />
        <TrendChartSeries
          chartPoints={chartPoints}
          config={config}
          gradientId={gradientId}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
