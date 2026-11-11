'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { niceTicks, type NiceTicks } from '@/_lib/chartAxis';
import type { CorrelationPointDTO } from '@/_types/progress';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function formatAxisDay(value: string): string {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}

interface CorrelationChartProps {
  points: CorrelationPointDTO[];
}

/** Weight (left axis) and diary-logging adherence (right axis, 0–100) over
 * the same date range, so the two signals can be visually compared. */
export function CorrelationChart({ points }: CorrelationChartProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Peso x adesão ao diário</CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        {points.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Sem dados suficientes para comparar neste período.
          </p>
        ) : (
          <div className="h-52 md:h-72">
            <CorrelationDrawing points={points} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function weightAxisFor(points: CorrelationPointDTO[]): NiceTicks {
  const weightValues = points
    .map(point => point.weight)
    .filter((value): value is number => value !== null);
  return weightValues.length > 0
    ? niceTicks(Math.min(...weightValues), Math.max(...weightValues))
    : { min: 0, max: 0, ticks: [] };
}

function CorrelationDrawing({ points }: { points: CorrelationPointDTO[] }) {
  const weightAxis = weightAxisFor(points);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={points}
        margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
      >
        <CorrelationAxes weightAxis={weightAxis} />
        <Tooltip content={<CorrelationTooltip />} />
        <CorrelationSeries />
      </LineChart>
    </ResponsiveContainer>
  );
}

function CorrelationAxes({ weightAxis }: { weightAxis: NiceTicks }) {
  return (
    <>
      <CartesianGrid
        vertical={false}
        stroke="var(--line)"
        strokeDasharray="3 3"
      />
      <XAxis
        dataKey="date"
        tickFormatter={formatAxisDay}
        stroke="var(--muted-foreground)"
        tick={{ fontSize: 11 }}
        tickMargin={8}
      />
      <YAxis
        yAxisId="weight"
        type="number"
        domain={[weightAxis.min, weightAxis.max]}
        ticks={weightAxis.ticks}
        stroke="var(--muted-foreground)"
        tick={{ fontSize: 11 }}
        width={40}
      />
      <YAxis
        yAxisId="adherence"
        orientation="right"
        type="number"
        domain={[0, 100]}
        stroke="var(--muted-foreground)"
        tick={{ fontSize: 11 }}
        width={40}
      />
    </>
  );
}

function CorrelationSeries() {
  return (
    <>
      <Line
        yAxisId="weight"
        type="monotone"
        dataKey="weight"
        stroke="var(--primary)"
        strokeWidth={2}
        dot={false}
        connectNulls
        isAnimationActive={false}
      />
      <Line
        yAxisId="adherence"
        type="monotone"
        dataKey="diaryAdherencePercent"
        stroke="var(--icon-accent)"
        strokeWidth={2}
        strokeDasharray="4 2"
        dot={false}
        connectNulls
        isAnimationActive={false}
      />
    </>
  );
}

function CorrelationTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: CorrelationPointDTO }>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground shadow-md">
      <p>{formatAxisDay(point.date)}</p>
      <p>
        Peso:{' '}
        {point.weight === null
          ? 'sem registro'
          : `${point.weight.toLocaleString('pt-BR')} kg`}
      </p>
      <p>
        Diário:{' '}
        {point.diaryAdherencePercent === null
          ? 'sem registro'
          : `${point.diaryAdherencePercent}%`}
      </p>
    </div>
  );
}
