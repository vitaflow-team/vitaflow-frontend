import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import type { PeriodComparisonMetricDTO } from '@/_types/progress';

interface PeriodComparisonCardProps {
  metrics: PeriodComparisonMetricDTO[];
}

const METRIC_LABEL: Record<PeriodComparisonMetricDTO['metric'], string> = {
  weight: 'Peso',
  diaryLoggedDays: 'Dias com diário preenchido',
};

function formatValue(
  metric: PeriodComparisonMetricDTO['metric'],
  value: number | null
): string {
  if (value === null) return '—';
  return metric === 'weight'
    ? `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg`
    : `${value} ${value === 1 ? 'dia' : 'dias'}`;
}

export function PeriodComparisonCard({ metrics }: PeriodComparisonCardProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle className="text-base">Mês atual x mês anterior</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {metrics.map(metric => (
          <div key={metric.metric}>
            <p className="text-sm text-muted-foreground">
              {METRIC_LABEL[metric.metric]}
            </p>
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="text-xl font-semibold">
                {formatValue(metric.metric, metric.current)}
              </p>
              <p className="text-sm text-muted-foreground">
                (mês anterior: {formatValue(metric.metric, metric.previous)})
              </p>
              {metric.deltaPercent !== null && (
                <p
                  className={
                    metric.deltaPercent >= 0
                      ? 'text-sm font-medium text-emerald-700 dark:text-emerald-400'
                      : 'text-sm font-medium text-amber-700 dark:text-amber-400'
                  }
                >
                  {metric.deltaPercent >= 0 ? '+' : ''}
                  {metric.deltaPercent}%
                </p>
              )}
              {metric.noActivityThisPeriod && (
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  Sem atividade neste mês
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
