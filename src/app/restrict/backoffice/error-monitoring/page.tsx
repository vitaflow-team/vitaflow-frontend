import { ErrorMonitoringView } from '@/_components/backoffice/errorMonitoringView';
import { redirectAccessDenied } from '@/_lib/accessDenied';
import { redirectUnlessAdminTier } from '@/_lib/adminTierAuthorization';
import {
  isErrorMonitoringLoadFailure,
  loadErrorList,
} from '@/_lib/errorMonitoring';

/** Admin-tier-only error-monitoring screen (US-001, ADR-001). */
export default async function BackofficeErrorMonitoringPage() {
  await redirectUnlessAdminTier();

  const result = await loadErrorList();
  if (result === 'forbidden') redirectAccessDenied();

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Monitoramento de erros
        </h1>
        <p className="text-muted-foreground text-sm">
          Falhas inesperadas capturadas em vitaflow-backend e vitaflow-frontend.
        </p>
      </div>
      <ErrorMonitoringView
        result={isErrorMonitoringLoadFailure(result) ? null : result}
        failed={result === 'failed'}
      />
    </div>
  );
}
