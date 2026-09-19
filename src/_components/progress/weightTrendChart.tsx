'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import type { TrendPoint } from '@/_types/progress';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface WeightTrendChartProps {
  data: TrendPoint[];
}

function formatAxisDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(value));
}

export function WeightTrendChart({ data }: WeightTrendChartProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Evolução do peso</CardTitle>
      </CardHeader>
      <CardContent className="h-72 pl-2">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
            Nenhum registro nas últimas 8 semanas.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 20, bottom: 8 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="recordedAt"
                tickFormatter={formatAxisDate}
                stroke="var(--muted-foreground)"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={['dataMin - 2', 'dataMax + 2']}
                stroke="var(--muted-foreground)"
                tick={{ fontSize: 12 }}
                unit=" kg"
                width={64}
              />
              <Tooltip
                labelFormatter={value =>
                  new Date(String(value)).toLocaleString('pt-BR')
                }
                formatter={value => [`${Number(value)} kg`, 'Peso']}
                contentStyle={{
                  background: 'var(--popover)',
                  borderColor: 'var(--border)',
                  color: 'var(--popover-foreground)',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--chart-1)"
                strokeWidth={3}
                dot={{ fill: 'var(--chart-1)', r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
