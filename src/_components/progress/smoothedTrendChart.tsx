'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { getTimeTicks, niceTicks, type NiceTicks } from '@/_lib/chartAxis';
import { formatAxisDate } from '@/_lib/trendMetrics';
import type { SmoothedWeightPoint } from '@/_types/progress';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface SmoothedChartDatum {
  t: number;
  weightKg: number;
  smoothedWeightKg: number | null;
}

export function toChartData(
  points: SmoothedWeightPoint[]
): SmoothedChartDatum[] {
  return points
    .map(point => ({
      t: Date.parse(point.recordedAt),
      weightKg: point.weightKg,
      smoothedWeightKg: point.smoothedWeightKg,
    }))
    .filter(point => Number.isFinite(point.t))
    .sort((a, b) => a.t - b.t);
}

interface SmoothedTrendChartProps {
  points: SmoothedWeightPoint[];
  period: { weeks: number; start: string; end: string };
}

/**
 * Raw daily weight (thin line) with its 7-day moving average overlaid (bold
 * line, absent for the first week of a period). A real time axis over the
 * backend-reported window, matching `trendChart.tsx`'s own convention.
 */
export function SmoothedTrendChart({
  points,
  period,
}: SmoothedTrendChartProps) {
  const data = toChartData(points);

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Tendência suavizada</CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Sem registros neste período.
          </p>
        ) : (
          <div className="h-52 md:h-72">
            <SmoothedTrendDrawing data={data} period={period} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface SmoothedTrendDrawingProps {
  data: SmoothedChartDatum[];
  period: { start: string; end: string };
}

function SmoothedTrendDrawing({ data, period }: SmoothedTrendDrawingProps) {
  const startMs = Date.parse(period.start);
  const endMs = Date.parse(period.end);
  const weightValues = data.map(point => point.weightKg);
  const yAxis =
    weightValues.length > 0
      ? niceTicks(Math.min(...weightValues), Math.max(...weightValues))
      : { min: 0, max: 0, ticks: [] };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <SmoothedTrendAxes startMs={startMs} endMs={endMs} yAxis={yAxis} />
        <Tooltip content={<SmoothedTrendTooltip />} />
        <SmoothedTrendSeries />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface SmoothedTrendAxesProps {
  startMs: number;
  endMs: number;
  yAxis: NiceTicks;
}

function SmoothedTrendAxes({ startMs, endMs, yAxis }: SmoothedTrendAxesProps) {
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
        domain={[yAxis.min, yAxis.max]}
        ticks={yAxis.ticks}
        stroke="var(--muted-foreground)"
        tick={{ fontSize: 11 }}
        width={40}
      />
    </>
  );
}

function SmoothedTrendSeries() {
  return (
    <>
      <Line
        type="monotone"
        dataKey="weightKg"
        stroke="var(--muted-foreground)"
        strokeWidth={1}
        dot={false}
        isAnimationActive={false}
      />
      <Line
        type="monotone"
        dataKey="smoothedWeightKg"
        stroke="var(--primary)"
        strokeWidth={2.5}
        dot={false}
        connectNulls={false}
        isAnimationActive={false}
      />
    </>
  );
}

function SmoothedTrendTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: SmoothedChartDatum }>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground shadow-md">
      <p>{new Date(point.t).toLocaleDateString('pt-BR')}</p>
      <p>Peso: {point.weightKg.toLocaleString('pt-BR')} kg</p>
      {point.smoothedWeightKg !== null && (
        <p>
          Média móvel (7 dias):{' '}
          {point.smoothedWeightKg.toLocaleString('pt-BR', {
            maximumFractionDigits: 1,
          })}{' '}
          kg
        </p>
      )}
    </div>
  );
}
