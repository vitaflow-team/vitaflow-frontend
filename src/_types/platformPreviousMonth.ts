import type { FinancialMonthTotals } from './financialMonthTotals';
import type { PlatformAccountTotals } from './platformAccountTotals';

/** The comparison base: the month before the selected one. */
export interface PlatformPreviousMonth {
  month: string;
  totals: FinancialMonthTotals;
  byAccountType: PlatformAccountTotals;
}
