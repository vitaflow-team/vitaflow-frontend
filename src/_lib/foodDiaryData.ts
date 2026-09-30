import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import type { LoadFailure } from '@/_types/loadFailure';
import type { DailySummary, MissingProfileField } from '@/_types/foodDiary';
import { unstable_rethrow } from 'next/navigation';

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  console.error(`Food diary: ${source} failed.`, { status });
  return 'failed';
}

export async function loadDailySummary(
  date: string
): Promise<DailySummary | LoadFailure> {
  try {
    return await apiClient<DailySummary>(
      `/food-diary/summary?date=${encodeURIComponent(date)}`,
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    return toFailure(error, 'summary');
  }
}

export async function loadMissingProfileFields(): Promise<
  MissingProfileField[] | LoadFailure
> {
  try {
    const result = await apiClient<{ missingFields: MissingProfileField[] }>(
      '/food-diary/profile-status',
      { method: 'GET', cache: 'no-store' }
    );
    return result.missingFields;
  } catch (error) {
    return toFailure(error, 'profile-status');
  }
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}

// Local date (not UTC) so "today" matches what the user's clock shows —
// the backend's `date` query param is just `YYYY-MM-DD`.
export function todayDateParam(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
