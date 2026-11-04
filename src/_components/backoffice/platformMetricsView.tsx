import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import {
  computeMrrTrend,
  formatCount,
  formatMrr,
  ROLE_LABELS,
} from '@/_lib/platformMetricsDisplay';
import type { ChurnByRole } from '@/_types/churnByRole';
import type { PlatformMetrics } from '@/_types/platformMetrics';
import type { PlatformRole } from '@/_types/platformRole';
import type { RegisteredByRole } from '@/_types/registeredByRole';
import { MetricTile } from './metricTile';

interface PlatformMetricsViewProps {
  metrics: PlatformMetrics | null;
  /** Backend unreachable — distinct from a legitimately empty breakdown. */
  failed: boolean;
}

const ROLE_ORDER: PlatformRole[] = [
  'USER',
  'NUTRITIONIST',
  'PHYSICAL_EDUCATOR',
  'ACADEMIA',
];

// A role missing from the response is a zero row, never an omitted one
// (US-002.EC-1, US-003.AC-3) — these two lookups guarantee all four roles
// always render, regardless of what the backend included.
function findRegistered(
  role: PlatformRole,
  list: RegisteredByRole[]
): RegisteredByRole {
  return (
    list.find(entry => entry.role === role) ?? {
      role,
      free: 0,
      premium: 0,
      newThisMonth: 0,
    }
  );
}

function findChurn(role: PlatformRole, list: ChurnByRole[]): ChurnByRole {
  return (
    list.find(entry => entry.role === role) ?? { role, canceledThisMonth: 0 }
  );
}

function MrrSection({ metrics }: { metrics: PlatformMetrics }) {
  const trend = computeMrrTrend(metrics.mrr.current, metrics.mrr.previousMonth);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita recorrente mensal (MRR)</CardTitle>
      </CardHeader>
      <CardContent>
        <MetricTile
          label="MRR atual"
          value={formatMrr(metrics.mrr.current)}
          trend={trend}
        />
      </CardContent>
    </Card>
  );
}

// Never "ativos" — these are registered/subscribed counts, not activity
// (ADR-002). Three tiles per role (Free, Premium, new this month): 4 roles
// × 3 = 12 of this screen's "over a dozen" `MetricTile` instances.
function RegisteredUsersSection({ metrics }: { metrics: PlatformMetrics }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários cadastrados por papel e plano</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {ROLE_ORDER.map(role => {
          const entry = findRegistered(role, metrics.registeredByRole);
          const label = ROLE_LABELS[role];
          return (
            <div key={role} className="flex flex-col gap-3">
              <MetricTile
                label={`${label} · Free`}
                value={formatCount(entry.free)}
              />
              <MetricTile
                label={`${label} · Premium`}
                value={formatCount(entry.premium)}
              />
              <MetricTile
                label={`${label} · Novos este mês`}
                value={formatCount(entry.newThisMonth)}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// One figure per role, never blended into a platform-wide total (ADR-003).
function ChurnSection({ metrics }: { metrics: PlatformMetrics }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cancelamentos por papel</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {ROLE_ORDER.map(role => {
          const entry = findChurn(role, metrics.churnByRole);
          return (
            <MetricTile
              key={role}
              label={ROLE_LABELS[role]}
              value={formatCount(entry.canceledThisMonth)}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}

/** Composes `MetricTile` into the three sections (MRR, registered users, churn). */
export function PlatformMetricsView({
  metrics,
  failed,
}: PlatformMetricsViewProps) {
  if (failed) {
    return (
      <p role="alert" className="text-destructive py-8 text-center text-sm">
        Não foi possível carregar as métricas agora. Tente novamente em alguns
        instantes.
      </p>
    );
  }

  if (!metrics) return null;

  return (
    <div className="flex flex-col gap-6">
      <MrrSection metrics={metrics} />
      <RegisteredUsersSection metrics={metrics} />
      <ChurnSection metrics={metrics} />
    </div>
  );
}
