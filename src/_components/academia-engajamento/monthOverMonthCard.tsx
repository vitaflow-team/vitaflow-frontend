import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import type { EngajamentoMonthOverMonth } from '@/_types/engajamento';

interface MonthOverMonthCardProps {
  data: EngajamentoMonthOverMonth;
}

export function MonthOverMonthCard({ data }: MonthOverMonthCardProps) {
  const { currentMonthCount, previousMonthCount, isCurrentMonthPartial } = data;
  const deltaPercent =
    previousMonthCount === null || previousMonthCount === 0
      ? null
      : Math.round(
          ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100
        );

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Check-ins: mês atual x mês anterior</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <p className="text-sm text-muted-foreground">
              Mês atual{isCurrentMonthPartial ? ' (em andamento)' : ''}
            </p>
            <p className="text-2xl font-semibold">{currentMonthCount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mês anterior</p>
            <p className="text-2xl font-semibold">
              {previousMonthCount ?? '—'}
            </p>
          </div>
          {deltaPercent !== null && (
            <p
              className={
                deltaPercent >= 0
                  ? 'text-sm font-medium text-emerald-700 dark:text-emerald-400'
                  : 'text-sm font-medium text-amber-700 dark:text-amber-400'
              }
            >
              {deltaPercent >= 0 ? '+' : ''}
              {deltaPercent}% em relação ao mês anterior
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
