import 'server-only';

import type { StaffListItem } from '@/_types/backofficeStaff';
import type { LoadFailure } from '@/_types/loadFailure';
import { unstable_rethrow } from 'next/navigation';
import { apiClient } from './apiClient';
import { AppError } from './AppError';

function toFailure(error: unknown): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  console.error('Backoffice staff: list failed.', { status });
  return 'failed';
}

/** `GET /backoffice/staff`, admin-interno-only (US-007 through US-009). */
export async function loadStaffList(): Promise<StaffListItem[] | LoadFailure> {
  try {
    return await apiClient<StaffListItem[]>(
      '/backoffice/staff',
      { method: 'GET' },
      { ownToken: true }
    );
  } catch (error) {
    return toFailure(error);
  }
}

export function isStaffLoadFailure(
  result: StaffListItem[] | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}
