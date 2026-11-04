import { PlatformMetricsView } from '@/_components/backoffice/platformMetricsView';
import { redirectAccessDenied } from '@/_lib/accessDenied';
import { redirectUnlessAdminTier } from '@/_lib/adminTierAuthorization';
import {
  isPlatformMetricsLoadFailure,
  loadPlatformMetrics,
} from '@/_lib/platformMetrics';

/** Admin-tier-only platform metrics dashboard (TechSpec Component Overview). */
export default async function BackofficeMetricsPage() {
  await redirectUnlessAdminTier();

  const result = await loadPlatformMetrics();
  if (result === 'forbidden') redirectAccessDenied();

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Métricas da plataforma
        </h1>
        <p className="text-muted-foreground text-sm">
          MRR, usuários cadastrados por papel/plano e cancelamentos por papel.
        </p>
      </div>
      <PlatformMetricsView
        metrics={isPlatformMetricsLoadFailure(result) ? null : result}
        failed={result === 'failed'}
      />
    </div>
  );
}
