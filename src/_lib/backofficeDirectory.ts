import 'server-only';

import type {
  DirectoryListResult,
  DirectoryTypeFilter,
} from '@/_types/backofficeDirectory';
import type { LoadFailure } from '@/_types/loadFailure';
import { unstable_rethrow } from 'next/navigation';
import { apiClient } from './apiClient';
import { AppError } from './AppError';

export interface DirectoryFilter {
  search?: string;
  type?: DirectoryTypeFilter;
  page: number;
}

function toQuery(filter: DirectoryFilter): string {
  const params = new URLSearchParams();
  if (filter.search) params.set('search', filter.search);
  if (filter.type) params.set('type', filter.type);
  params.set('page', String(filter.page));
  return `?${params.toString()}`;
}

function toFailure(error: unknown): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  console.error('Backoffice directory: search failed.', { status });
  return 'failed';
}

/** `GET /backoffice/accounts` — always the staff member's own token (US-001). */
export async function loadDirectory(
  filter: DirectoryFilter
): Promise<DirectoryListResult | LoadFailure> {
  try {
    return await apiClient<DirectoryListResult>(
      `/backoffice/accounts${toQuery(filter)}`,
      { method: 'GET' },
      { ownToken: true }
    );
  } catch (error) {
    return toFailure(error);
  }
}

export function isDirectoryLoadFailure(
  result: DirectoryListResult | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}
