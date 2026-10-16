import 'server-only';

import type { AuditLogListResult } from '@/_types/backofficeAuditLog';
import type { LoadFailure } from '@/_types/loadFailure';
import { unstable_rethrow } from 'next/navigation';
import { apiClient } from './apiClient';
import { AppError } from './AppError';

export interface AuditLogFilter {
  page: number;
}

function toFailure(error: unknown): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  console.error('Backoffice audit log: list failed.', { status });
  return 'failed';
}

/** `GET /backoffice/audit-log`, admin-interno-only (US-011). */
export async function loadAuditLog(
  filter: AuditLogFilter
): Promise<AuditLogListResult | LoadFailure> {
  try {
    return await apiClient<AuditLogListResult>(
      `/backoffice/audit-log?page=${filter.page}`,
      { method: 'GET' },
      { ownToken: true }
    );
  } catch (error) {
    return toFailure(error);
  }
}

export function isAuditLogLoadFailure(
  result: AuditLogListResult | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}
