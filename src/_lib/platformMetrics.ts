import 'server-only';

import type { LoadFailure } from '@/_types/loadFailure';
import type { PlatformMetrics } from '@/_types/platformMetrics';
import { unstable_rethrow } from 'next/navigation';
import { apiClient } from './apiClient';
import { AppError } from './AppError';

function toFailure(error: unknown): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  console.error('Backoffice platform metrics: load failed.', { status });
  return 'failed';
}

/** `GET /backoffice/metrics`, admin-tier-only (TechSpec API Endpoints). */
export async function loadPlatformMetrics(): Promise<
  PlatformMetrics | LoadFailure
> {
  try {
    return await apiClient<PlatformMetrics>(
      '/backoffice/metrics',
      { method: 'GET' },
      { ownToken: true }
    );
  } catch (error) {
    return toFailure(error);
  }
}

export function isPlatformMetricsLoadFailure(
  result: PlatformMetrics | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}
