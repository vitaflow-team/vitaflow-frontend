import type { FinancialMonthTotals } from './financialMonthTotals';
import type { PlatformAccountTotals } from './platformAccountTotals';
import type { PlatformOverdue } from './platformOverdue';
import type { PlatformPreviousMonth } from './platformPreviousMonth';

/**
 * `GET /backoffice/financial-health/summary` (ADMIN only). `available: false`
 * means the month precedes the first stored payment: its figures are `null`,
 * never zero, while `overdue` still shows today.
 */
export interface PlatformSummary {
  month: string;
  available: boolean;
  /** When the payments were last synced from the gateway. */
  syncedAt: string | null;
  totals: FinancialMonthTotals | null;
  byAccountType: PlatformAccountTotals | null;
  /** `null` when there is no usable comparison base. */
  previous: PlatformPreviousMonth | null;
  overdue: PlatformOverdue;
}
