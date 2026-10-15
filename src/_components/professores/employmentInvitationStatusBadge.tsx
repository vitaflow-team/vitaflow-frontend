import { cn } from '@/_lib/utils';

type ProfessorRowStatus = 'ACTIVE' | 'PENDING';

const LABELS: Record<ProfessorRowStatus, string> = {
  ACTIVE: 'Ativo',
  PENDING: 'Convite pendente',
};

const STYLES: Record<ProfessorRowStatus, string> = {
  ACTIVE:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
};

interface EmploymentInvitationStatusBadgeProps {
  status: ProfessorRowStatus;
}

export function EmploymentInvitationStatusBadge({
  status,
}: EmploymentInvitationStatusBadgeProps) {
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
