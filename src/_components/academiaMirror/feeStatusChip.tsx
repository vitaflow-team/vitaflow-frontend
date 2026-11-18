import { cn } from '@/_lib/utils';
import type { MembershipFeeStatus } from '@/_types/membershipFeeStatus';

// The label is the status; color only reinforces it, never carries it alone.
const LABELS: Record<MembershipFeeStatus, string> = {
  PENDING: 'Pendente',
  OVERDUE: 'Em atraso',
  PAID: 'Pago',
};

const STYLES: Record<MembershipFeeStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  OVERDUE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  PAID: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
};

interface FeeStatusChipProps {
  status: MembershipFeeStatus;
}

export function FeeStatusChip({ status }: FeeStatusChipProps) {
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
