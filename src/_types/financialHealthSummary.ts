import type { FinancialAudience } from './financialAudience';
import type { FinancialBillingState } from './financialBillingState';
import type { FinancialMonthTotals } from './financialMonthTotals';
import type { FinancialOverdue } from './financialOverdue';

/** `GET /financial-health/summary` — the same shape for professionals and gyms. */
export interface FinancialHealthSummary {
  audience: FinancialAudience;
  billingState: FinancialBillingState;
  hasHistory: boolean;
  /** `YYYY-MM`, the month the figures are for. */
  month: string;
  current: FinancialMonthTotals;
  previous: FinancialMonthTotals;
  overdue: FinancialOverdue;
}
