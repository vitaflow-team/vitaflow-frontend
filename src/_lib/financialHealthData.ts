import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import { loadBillingAccount } from '@/_lib/billingData';
import { isLoadFailure } from '@/_lib/isLoadFailure';
import type { DelinquentsPage } from '@/_types/delinquentsPage';
import type { FinancialHealthSummary } from '@/_types/financialHealthSummary';
import type { FinancialPanelData } from '@/_types/financialPanelData';
import type { FinancialPanelQuery } from '@/_types/financialPanelQuery';
import type { LoadFailure } from '@/_types/loadFailure';
import { unstable_rethrow } from 'next/navigation';

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  console.error(`Financial health: ${source} failed.`, { status });
  return 'failed';
}

/** `GET /financial-health/summary` for a validated `YYYY-MM`. */
export async function loadFinancialHealth(
  month: string
): Promise<FinancialHealthSummary | LoadFailure> {
  try {
    return await apiClient<FinancialHealthSummary>(
      `/financial-health/summary?month=${encodeURIComponent(month)}`,
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    return toFailure(error, 'summary');
  }
}

/** `GET /financial-health/delinquents`; the backend clamps a page past the end. */
export async function loadDelinquents(
  page: number
): Promise<DelinquentsPage | LoadFailure> {
  try {
    return await apiClient<DelinquentsPage>(
      `/financial-health/delinquents?page=${page}`,
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    return toFailure(error, 'delinquents');
  }
}

/**
 * Whether the owner's plan can issue invoices (Premium for a professional, a
 * paid subscription for a gym). Only asked when the account is not connected,
 * and an unknown answer never changes what the panel shows.
 */
async function loadCanBill(
  summary: FinancialHealthSummary | LoadFailure
): Promise<boolean | null> {
  if (isLoadFailure(summary) || summary.billingState === 'CONNECTED') {
    return null;
  }
  const account = await loadBillingAccount();
  return isLoadFailure(account) ? null : account.premium;
}

/** Both reads of a panel, each failing on its own. */
export async function loadFinancialPanel(
  query: FinancialPanelQuery
): Promise<FinancialPanelData> {
  const [summary, delinquents] = await Promise.all([
    loadFinancialHealth(query.month),
    loadDelinquents(query.page),
  ]);
  return { summary, delinquents, canBill: await loadCanBill(summary) };
}
