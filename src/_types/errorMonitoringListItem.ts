import type { ErrorMonitoringApp } from '@/_types/errorMonitoringApp';
import type { SentryIssueSummary } from '@/_types/sentryIssueSummary';

/** A list entry, tagged with the app it came from (US-001.AC-2). */
export type ErrorMonitoringListItem = SentryIssueSummary & {
  app: ErrorMonitoringApp;
};
