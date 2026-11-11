import type {
  AcademiaMembership,
  AccessPlanStatus,
} from '@/_types/academiaMirror';
import { cn } from '@/_lib/utils';
import { AccessPlanHistoryList } from './accessPlanHistoryList';

const STATUS_LABELS: Record<AccessPlanStatus, string> = {
  VALID: 'Válido',
  EXPIRED: 'Plano vencido',
  EXHAUSTED: 'Visitas esgotadas',
  NO_PLAN: 'Sem plano ativo',
};

const STATUS_STYLES: Record<AccessPlanStatus, string> = {
  VALID:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  EXPIRED: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  EXHAUSTED:
    'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  NO_PLAN: 'bg-muted text-muted-foreground',
};

function remainingLabel(membership: AcademiaMembership): string | null {
  const { currentPlan } = membership;
  if (currentPlan.status !== 'VALID' || currentPlan.remaining === null) {
    return null;
  }
  return currentPlan.validityType === 'DAYS'
    ? `${currentPlan.remaining} dia(s) restante(s)`
    : `${currentPlan.remaining} visita(s) restante(s)`;
}

function validityLabel(membership: AcademiaMembership): string | null {
  const { currentPlan } = membership;
  if (!currentPlan.planName || !currentPlan.validityType) return null;
  return currentPlan.validityType === 'DAYS'
    ? `${currentPlan.planName} · ${currentPlan.validityValue} dias`
    : `${currentPlan.planName} · ${currentPlan.validityValue} visitas`;
}

// US-001: no status here ever carries a call-to-action — no link, no
// button, no instructional copy (ADR-003). The screen only reports what
// the gym already assigned.
export function AcademiaMembershipCard({
  membership,
}: {
  membership: AcademiaMembership;
}) {
  const { currentPlan } = membership;
  const remaining = remainingLabel(membership);
  const validity = validityLabel(membership);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold">{membership.academiaName}</h3>
        <span
          className={cn(
            'inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold',
            STATUS_STYLES[currentPlan.status]
          )}
        >
          {STATUS_LABELS[currentPlan.status]}
        </span>
      </div>
      {validity && <p className="text-sm text-muted-foreground">{validity}</p>}
      {remaining && <p className="text-sm font-medium">{remaining}</p>}
      <AccessPlanHistoryList history={membership.history} />
    </div>
  );
}
