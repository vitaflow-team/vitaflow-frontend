import type { CurrentAccessPlan } from '@/_types/studentAccessPlan';

const STATUS_LABELS: Record<CurrentAccessPlan['status'], string> = {
  NO_PLAN: 'Sem plano atribuído',
  VALID: 'Válido',
  EXPIRED: 'Fora da validade',
  EXHAUSTED: 'Acessos esgotados',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface CurrentPlanSummaryProps {
  current: CurrentAccessPlan;
}

/** Where the student's access stands: the status, and the expiry or the visits left. */
export function CurrentPlanSummary({ current }: CurrentPlanSummaryProps) {
  const { plan } = current;

  return (
    <div className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{STATUS_LABELS[current.status]}</span>
      {plan?.validityType === 'DAYS' && plan.expiresAt && (
        <span className="text-muted-foreground">
          Expira em {formatDate(plan.expiresAt)}
        </span>
      )}
      {plan?.validityType === 'VISITS' && (
        <span className="text-muted-foreground">
          {current.remaining} acessos restantes
        </span>
      )}
    </div>
  );
}
