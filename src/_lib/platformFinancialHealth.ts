import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import { isPlatformFailure } from '@/_lib/isPlatformFailure';
import type { FinancialPanelQuery } from '@/_types/financialPanelQuery';
import type { LoadFailure } from '@/_types/loadFailure';
import type { PlatformDelinquentsFailure } from '@/_types/platformDelinquentsFailure';
import type { PlatformDelinquentsPage } from '@/_types/platformDelinquentsPage';
import type { PlatformFinancialData } from '@/_types/platformFinancialData';
import type { PlatformSummary } from '@/_types/platformSummary';
import { unstable_rethrow } from 'next/navigation';

const BASE_PATH = '/backoffice/financial-health';
const ACCESS_LOG_FAILED = 'access_log_failed';

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  console.error(`Backoffice financial health: ${source} failed.`, { status });
  return 'failed';
}

/** `GET /backoffice/financial-health/summary`, ADMIN only, for a validated `YYYY-MM`. */
export async function loadPlatformSummary(
  month: string
): Promise<PlatformSummary | LoadFailure> {
  try {
    return await apiClient<PlatformSummary>(
      `${BASE_PATH}/summary?month=${encodeURIComponent(month)}`,
      { method: 'GET', cache: 'no-store' },
      { ownToken: true }
    );
  } catch (error) {
    return toFailure(error, 'summary');
  }
}

/**
 * `GET /backoffice/financial-health/delinquents`, ADMIN or EQUIPE. The backend
 * records the access before answering; when it cannot, it answers 503
 * `access_log_failed` with no data, and that is reported as its own case.
 */
export async function loadPlatformDelinquents(
  page: number
): Promise<PlatformDelinquentsPage | PlatformDelinquentsFailure> {
  try {
    return await apiClient<PlatformDelinquentsPage>(
      `${BASE_PATH}/delinquents?page=${page}`,
      { method: 'GET', cache: 'no-store' },
      { ownToken: true }
    );
  } catch (error) {
    if (error instanceof AppError && error.code === ACCESS_LOG_FAILED) {
      return 'access-log-failed';
    }
    return toFailure(error, 'delinquents');
  }
}

/**
 * The list is read first: its `tier` decides whether the summary is requested
 * at all, so an EQUIPE member never makes (or fails) a request for totals.
 */
export async function loadPlatformFinancialPanel(
  query: FinancialPanelQuery
): Promise<PlatformFinancialData> {
  const delinquents = await loadPlatformDelinquents(query.page);
  if (isPlatformFailure(delinquents) || delinquents.tier !== 'ADMIN') {
    return { delinquents, summary: null };
  }
  return { delinquents, summary: await loadPlatformSummary(query.month) };
}
