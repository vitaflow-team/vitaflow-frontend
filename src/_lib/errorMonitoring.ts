import 'server-only';

import type { ErrorMonitoringApp } from '@/_types/errorMonitoringApp';
import type { ErrorMonitoringListResult } from '@/_types/errorMonitoringListResult';
import type { LoadFailure } from '@/_types/loadFailure';
import type { SentryIssueDetail } from '@/_types/sentryIssueDetail';
import { unstable_rethrow } from 'next/navigation';
import { apiClient } from './apiClient';
import { AppError } from './AppError';

function toFailure(error: unknown, context: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  console.error(`Backoffice error monitoring: ${context} failed.`, {
    status,
  });
  return 'failed';
}

/** `GET /backoffice/error-monitoring` (US-001). */
export async function loadErrorList(): Promise<
  ErrorMonitoringListResult | LoadFailure
> {
  try {
    return await apiClient<ErrorMonitoringListResult>(
      '/backoffice/error-monitoring',
      { method: 'GET' },
      { ownToken: true }
    );
  } catch (error) {
    return toFailure(error, 'list');
  }
}

export function isErrorMonitoringLoadFailure(
  result: ErrorMonitoringListResult | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}

/** `GET /backoffice/error-monitoring/:app/:issueId` (US-002). */
export async function loadErrorDetail(
  app: ErrorMonitoringApp,
  issueId: string
): Promise<SentryIssueDetail | LoadFailure> {
  try {
    return await apiClient<SentryIssueDetail>(
      `/backoffice/error-monitoring/${app}/${issueId}`,
      { method: 'GET' },
      { ownToken: true }
    );
  } catch (error) {
    return toFailure(error, 'detail');
  }
}

export function isErrorDetailLoadFailure(
  result: SentryIssueDetail | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}
