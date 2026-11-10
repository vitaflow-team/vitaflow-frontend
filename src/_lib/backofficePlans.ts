import 'server-only';

import type { ProductCatalogEntry } from '@/_types/backofficePlans';
import type { LoadFailure } from '@/_types/loadFailure';
import { unstable_rethrow } from 'next/navigation';
import { apiClient } from './apiClient';
import { AppError } from './AppError';

function toFailure(error: unknown): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  console.error('Backoffice plans: catalog load failed.', { status });
  return 'failed';
}

/**
 * `GET /backoffice/plans` — the full product/pricing catalog, every role and
 * tier, active and inactive (PRD US-001). Available to both backoffice
 * tiers; only the mutating routes are `AdminTierGuard`-gated (ADR-005).
 */
export async function loadPlansCatalog(): Promise<
  ProductCatalogEntry[] | LoadFailure
> {
  try {
    return await apiClient<ProductCatalogEntry[]>(
      '/backoffice/plans',
      { method: 'GET' },
      { ownToken: true }
    );
  } catch (error) {
    return toFailure(error);
  }
}

export function isPlansLoadFailure(
  result: ProductCatalogEntry[] | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}
