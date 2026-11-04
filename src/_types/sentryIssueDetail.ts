import type { SentryIssueSummary } from '@/_types/sentryIssueSummary';

/**
 * Full detail for one issue. `stackTrace` is `''` (never thrown) when
 * Sentry's latest event for the issue has no frames (US-002.EC-2).
 */
export interface SentryIssueDetail extends SentryIssueSummary {
  stackTrace: string;
}
