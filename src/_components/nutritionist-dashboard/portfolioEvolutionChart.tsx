'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { niceTicks } from '@/_lib/chartAxis';
import type { PortfolioEvolutionPoint } from '@/_types/nutritionistDashboard';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface PortfolioEvolutionChartProps {
  points: PortfolioEvolutionPoint[];
}

/** Average % change from each patient's own starting weight, by months in
 * care (ADR-009) — never a raw average of absolute weights. */
export function PortfolioEvolutionChart({
  points,
}: PortfolioEvolutionChartProps) {
  const sorted = [...points].sort((a, b) => a.monthsInCare - b.monthsInCare);

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Evolução do peso da carteira</CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        {sorted.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum paciente com dados de peso suficientes ainda.
          </p>
        ) : (
          <div className="h-52 md:h-64">
            <PortfolioEvolutionDrawing points={sorted} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PortfolioEvolutionDrawing({
  points,
}: {
  points: PortfolioEvolutionPoint[];
}) {
  const changeValues = points.map(point => point.avgPercentChangeFromStart);
  const axis =
    changeValues.length > 0
      ? niceTicks(Math.min(0, ...changeValues), Math.max(0, ...changeValues))
      : { min: 0, max: 0, ticks: [] };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={points}
        margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
      >
        <CartesianGrid
          vertical={false}
          stroke="var(--line)"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="monthsInCare"
          tickFormatter={value => `${value}m`}
          stroke="var(--muted-foreground)"
          tick={{ fontSize: 11 }}
          tickMargin={8}
        />
        <YAxis
          domain={[axis.min, axis.max]}
          ticks={axis.ticks}
          tickFormatter={value => `${value}%`}
          stroke="var(--muted-foreground)"
          tick={{ fontSize: 11 }}
          width={48}
        />
        <Tooltip content={<PortfolioEvolutionTooltip />} />
        <Line
          type="monotone"
          dataKey="avgPercentChangeFromStart"
          stroke="var(--primary)"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function PortfolioEvolutionTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: PortfolioEvolutionPoint }>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground shadow-md">
      <p>{point.monthsInCare} meses de acompanhamento</p>
      <p>
        {point.avgPercentChangeFromStart >= 0 ? '+' : ''}
        {point.avgPercentChangeFromStart}% em relação ao peso inicial
      </p>
      <p>
        {point.contributingPatientCount}{' '}
        {point.contributingPatientCount === 1 ? 'paciente' : 'pacientes'}
      </p>
    </div>
  );
}
