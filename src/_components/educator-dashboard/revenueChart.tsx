'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/_components/ui/table';
import { niceTicks, type NiceTicks } from '@/_lib/chartAxis';
import type { RevenueSeriesPoint } from '@/_types/educatorDashboard';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface MonthlyTotal {
  year: number;
  month: number;
  amountCents: number;
}

function formatCurrency(amountCents: number): string {
  return (amountCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatMonthLabel(year: number, month: number): string {
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('pt-BR', {
    month: 'short',
    year: '2-digit',
  });
}

function monthlyTotals(points: RevenueSeriesPoint[]): MonthlyTotal[] {
  const totals = new Map<string, MonthlyTotal>();
  for (const point of points) {
    const key = `${point.year}-${point.month}`;
    const existing = totals.get(key);
    totals.set(key, {
      year: point.year,
      month: point.month,
      amountCents: (existing?.amountCents ?? 0) + point.amountCents,
    });
  }
  return [...totals.values()].sort(
    (a, b) => a.year - b.year || a.month - b.month
  );
}

interface RevenueChartProps {
  points: RevenueSeriesPoint[];
}

/** Total revenue per month (bar chart) plus a per-student breakdown table,
 * since a per-student-per-month multi-line chart would have one series per
 * student — unreadable at any realistic portfolio size. */
export function RevenueChart({ points }: RevenueChartProps) {
  const totals = monthlyTotals(points);

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Receita por mês</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-2 sm:px-4">
        {totals.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma receita registrada ainda.
          </p>
        ) : (
          <>
            <div className="h-52 md:h-64">
              <RevenueBarChart totals={totals} />
            </div>
            <RevenueBreakdownTable points={points} />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function RevenueBarChart({ totals }: { totals: MonthlyTotal[] }) {
  const amounts = totals.map(point => point.amountCents);
  const axis: NiceTicks =
    amounts.length > 0
      ? niceTicks(0, Math.max(...amounts))
      : { min: 0, max: 0, ticks: [] };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={totals}
        margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
      >
        <CartesianGrid
          vertical={false}
          stroke="var(--line)"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="month"
          tickFormatter={(_, index) =>
            formatMonthLabel(totals[index].year, totals[index].month)
          }
          stroke="var(--muted-foreground)"
          tick={{ fontSize: 11 }}
          tickMargin={8}
        />
        <YAxis
          domain={[axis.min, axis.max]}
          ticks={axis.ticks}
          tickFormatter={value => formatCurrency(Number(value))}
          stroke="var(--muted-foreground)"
          tick={{ fontSize: 11 }}
          width={72}
        />
        <Tooltip content={<RevenueTooltip />} />
        <Bar dataKey="amountCents" fill="var(--primary)" radius={2} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function RevenueTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: MonthlyTotal }>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground shadow-md">
      <p>{formatMonthLabel(point.year, point.month)}</p>
      <p>{formatCurrency(point.amountCents)}</p>
    </div>
  );
}

function RevenueBreakdownTable({ points }: { points: RevenueSeriesPoint[] }) {
  const byStudent = [...points].sort(
    (a, b) =>
      b.year - a.year ||
      b.month - a.month ||
      a.clientName.localeCompare(b.clientName)
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Aluno</TableHead>
          <TableHead>Mês</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {byStudent.map((point, index) => (
          <TableRow
            key={`${point.clientId}-${point.year}-${point.month}-${index}`}
          >
            <TableCell>{point.clientName}</TableCell>
            <TableCell>{formatMonthLabel(point.year, point.month)}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(point.amountCents)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
