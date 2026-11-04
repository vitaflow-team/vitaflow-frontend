import { ErrorDetailView } from '@/_components/backoffice/errorDetailView';
import { redirectAccessDenied } from '@/_lib/accessDenied';
import { redirectUnlessAdminTier } from '@/_lib/adminTierAuthorization';
import {
  isErrorDetailLoadFailure,
  loadErrorDetail,
} from '@/_lib/errorMonitoring';
import type { ErrorMonitoringApp } from '@/_types/errorMonitoringApp';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ app: string; issueId: string }>;
}

function parseApp(value: string): ErrorMonitoringApp | null {
  return value === 'backend' || value === 'frontend' ? value : null;
}

/** Admin-tier-only issue detail (US-002, ADR-001). */
export default async function BackofficeErrorDetailPage({ params }: PageProps) {
  await redirectUnlessAdminTier();

  const { app: appParam, issueId } = await params;
  const app = parseApp(appParam);
  if (!app) notFound();

  const result = await loadErrorDetail(app, issueId);
  if (result === 'not-found') notFound();
  if (result === 'forbidden') redirectAccessDenied();

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Detalhe do erro
        </h1>
      </div>
      <ErrorDetailView
        app={app}
        detail={isErrorDetailLoadFailure(result) ? null : result}
        failed={result === 'failed'}
      />
    </div>
  );
}
