import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import {
  computeMrrTrend,
  formatCohortMonthLabel,
  formatCount,
  formatMrr,
  ROLE_LABELS,
} from '@/_lib/platformMetricsDisplay';
import type { ChurnByRole } from '@/_types/churnByRole';
import type { CohortRetentionRow } from '@/_types/cohortRetentionRow';
import type { PlatformMetrics } from '@/_types/platformMetrics';
import type { PlatformRole } from '@/_types/platformRole';
import type { RegisteredByRole } from '@/_types/registeredByRole';
import { CohortRetentionGrid } from './cohortRetentionGrid';
import { MetricTile } from './metricTile';

type CohortPlan = 'FREE' | 'PREMIUM';
const PLAN_ORDER: CohortPlan[] = ['FREE', 'PREMIUM'];
const PLAN_LABELS: Record<CohortPlan, string> = {
  FREE: 'Free',
  PREMIUM: 'Premium',
};

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

// Newest cohort first, matching market convention (ChartMogul/Baremetrics) —
// "yyyy-MM" sorts correctly as a plain string.
function segmentRows(
  rows: CohortRetentionRow[],
  role: PlatformRole,
  plan: CohortPlan
): CohortRetentionRow[] {
  return rows
    .filter(row => row.role === role && row.plan === plan)
    .sort((a, b) => b.cohortMonth.localeCompare(a.cohortMonth));
}

interface CohortRetentionSegmentProps {
  metrics: PlatformMetrics;
  role: PlatformRole;
  plan: CohortPlan;
}

function CohortRetentionSegment({
  metrics,
  role,
  plan,
}: CohortRetentionSegmentProps) {
  const rows = segmentRows(metrics.cohortRetention, role, plan);
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">{PLAN_LABELS[plan]}</span>
      <CohortRetentionGrid
        rowLabels={rows.map(row => formatCohortMonthLabel(row.cohortMonth))}
        columnCount={12}
        cells={rows.map(row => row.retainedPercentByMonth)}
      />
    </div>
  );
}

// Retention (all accounts, Free + Premium each shown) is deliberately a
// separate section from LTV (Premium-only) below, so the two are never read
// as sharing one denominator (ADR-004).
function CohortRetentionSection({ metrics }: { metrics: PlatformMetrics }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Retenção por coorte de cadastro (últimos 12 meses)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        {ROLE_ORDER.map(role => (
          <div key={role} className="flex flex-col gap-4">
            <h3 className="text-sm font-medium">{ROLE_LABELS[role]}</h3>
            {PLAN_ORDER.map(plan => (
              <CohortRetentionSegment
                key={plan}
                metrics={metrics}
                role={role}
                plan={plan}
              />
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Premium-only (ADR-004); a role with no active Premium product is simply
// absent here (US-002.EC-3) — never rendered as a zero-default tile.
function LtvBySegmentSection({ metrics }: { metrics: PlatformMetrics }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>LTV projetado por segmento (apenas Premium)</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {metrics.ltvBySegment.map(entry => (
          <MetricTile
            key={entry.role}
            label={ROLE_LABELS[entry.role]}
            value={entry.ltv === null ? '—' : formatMrr(entry.ltv)}
            trend={
              entry.ltv === null
                ? { label: 'Dados insuficientes', tone: 'unavailable' }
                : undefined
            }
          />
        ))}
      </CardContent>
    </Card>
  );
}

/** Composes `MetricTile` into five sections (MRR, registered users, churn, cohort retention, LTV by segment). */
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
      <CohortRetentionSection metrics={metrics} />
      <LtvBySegmentSection metrics={metrics} />
    </div>
  );
}
