import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import type { SettingsTab } from '@/_lib/settingsTabs';
import type { BillingAccount, InvoiceList } from '@/_types/billing';
import type { SettingsProfile } from '@/_types/settingsProfile';
import type { LoadFailure } from '@/_types/loadFailure';
import { unstable_rethrow } from 'next/navigation';

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  console.error(`Billing: ${source} failed.`, { status });
  return 'failed';
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}

async function guarded<T>(
  source: string,
  load: () => Promise<T>
): Promise<T | LoadFailure> {
  try {
    return await load();
  } catch (error) {
    return toFailure(error, source);
  }
}

export async function loadBillingAccount(): Promise<
  BillingAccount | LoadFailure
> {
  return await guarded('account', () =>
    apiClient<BillingAccount>('/billing/account', {
      method: 'GET',
      cache: 'no-store',
    })
  );
}

/** Only fetched when the "Cobrança" tab of Configurações is the active one. */
export async function loadBillingAccountForTab(
  tab: SettingsTab,
  profile: SettingsProfile | null
): Promise<BillingAccount | LoadFailure | null> {
  if (tab !== 'cobranca') return null;
  if (
    profile?.productType !== 'NUTRITIONIST' &&
    profile?.productType !== 'PHYSICAL_EDUCATOR'
  ) {
    return null;
  }
  return await loadBillingAccount();
}

export async function loadStudentInvoices(
  clientId: string,
  page: number
): Promise<InvoiceList | LoadFailure> {
  return await guarded('invoices', () =>
    apiClient<InvoiceList>(
      `/billing/students/${clientId}/invoices?page=${page}`,
      { method: 'GET', cache: 'no-store' }
    )
  );
}
