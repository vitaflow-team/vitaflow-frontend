import { appLabel, formatMoment } from '@/_lib/errorMonitoringDisplay';
import type { ErrorMonitoringApp } from '@/_types/errorMonitoringApp';
import type { SentryIssueDetail } from '@/_types/sentryIssueDetail';

interface ErrorDetailViewProps {
  app: ErrorMonitoringApp;
  detail: SentryIssueDetail | null;
  /** Backend unreachable (`sentry_unavailable`) for this single issue. */
  failed: boolean;
}

/** Read-only issue detail: stack trace plus context (US-002, ADR-001). */
export function ErrorDetailView({ app, detail, failed }: ErrorDetailViewProps) {
  if (failed || !detail) {
    return (
      <p role="alert" className="text-destructive py-8 text-center text-sm">
        Não foi possível carregar este erro agora. Tente novamente em alguns
        instantes.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-muted-foreground">App</dt>
          <dd>{appLabel(app)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Status</dt>
          <dd>{detail.status}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Primeira ocorrência</dt>
          <dd>{formatMoment(detail.firstSeen)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Última ocorrência</dt>
          <dd>{formatMoment(detail.lastSeen)}</dd>
        </div>
      </dl>
      <p className="text-sm">
        <span className="text-muted-foreground">Culprit: </span>
        {detail.culprit}
      </p>
      {detail.stackTrace ? (
        <pre className="overflow-x-auto rounded-md border bg-secondary/40 p-4 text-xs whitespace-pre-wrap">
          {detail.stackTrace}
        </pre>
      ) : (
        <p className="text-muted-foreground text-sm">
          Nenhum stack trace disponível para este evento.
        </p>
      )}
    </div>
  );
}
