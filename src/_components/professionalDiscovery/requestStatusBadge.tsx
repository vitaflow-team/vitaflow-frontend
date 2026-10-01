import { cn } from '@/_lib/utils';
import type { ConnectionRequestStatus } from '@/_types/professionalDiscovery';

const LABELS: Record<ConnectionRequestStatus, string> = {
  PENDING: 'Pendente',
  ACCEPTED: 'Aceita',
  DECLINED: 'Recusada',
};

const STYLES: Record<ConnectionRequestStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  ACCEPTED:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  DECLINED: 'bg-muted text-muted-foreground',
};

interface RequestStatusBadgeProps {
  status: ConnectionRequestStatus;
}

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
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
