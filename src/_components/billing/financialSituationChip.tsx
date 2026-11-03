import { cn } from '@/_lib/utils';
import type { FinancialSituation } from '@/_types/billing';

const LABELS: Record<FinancialSituation, string> = {
  OVERDUE: 'Em atraso',
  PENDING: 'Pendente',
  UP_TO_DATE: 'Em dia',
  NONE: 'Sem cobrança',
};

const STYLES: Record<FinancialSituation, string> = {
  OVERDUE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  UP_TO_DATE:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  NONE: 'bg-muted text-muted-foreground',
};

interface FinancialSituationChipProps {
  situation: FinancialSituation;
}

export function FinancialSituationChip({
  situation,
}: FinancialSituationChipProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        STYLES[situation]
      )}
    >
      {LABELS[situation]}
    </span>
  );
}
