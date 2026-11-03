import { cn } from '@/_lib/utils';
import type { InvoiceStatus } from '@/_types/billing';

// Labels are the status: color only reinforces, never carries it alone
// (task_04 requirement — statuses never rely on color alone).
const LABELS: Record<InvoiceStatus, string> = {
  PENDING: 'Pendente',
  OVERDUE: 'Em atraso',
  PAID: 'Paga',
  PAID_MANUALLY: 'Paga manualmente',
  CANCELED: 'Cancelada',
};

const STYLES: Record<InvoiceStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  OVERDUE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  PAID: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  PAID_MANUALLY:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  CANCELED: 'bg-muted text-muted-foreground',
};

interface InvoiceStatusChipProps {
  status: InvoiceStatus;
}

export function InvoiceStatusChip({ status }: InvoiceStatusChipProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        STYLES[status]
      )}
    >
      {LABELS[status]}
    </span>
  );
}
