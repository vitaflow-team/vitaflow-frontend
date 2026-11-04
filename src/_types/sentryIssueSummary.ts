/** One grouped Sentry issue, as returned by the backend's error-monitoring list endpoint. */
export interface SentryIssueSummary {
  id: string;
  title: string;
  culprit: string;
  level: 'error' | 'fatal';
  count: number;
  firstSeen: string;
  lastSeen: string;
  status: 'unresolved' | 'resolved' | 'ignored';
}
