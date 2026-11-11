import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import type { EducatorDashboardSummary } from '@/_types/educatorDashboard';
import type { LoadFailure } from '@/_types/loadFailure';
import { unstable_rethrow } from 'next/navigation';

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  console.error(`EducatorDashboard: ${source} failed.`, { status });
  return 'failed';
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}

export async function loadEducatorDashboard(): Promise<
  EducatorDashboardSummary | LoadFailure
> {
  try {
    return await apiClient<EducatorDashboardSummary>(
      '/educator/students/dashboard',
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    return toFailure(error, 'summary');
  }
}
