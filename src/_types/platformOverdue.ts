import type { FinancialOverdue } from './financialOverdue';
import type { PlatformRole } from './platformRole';

/** Today's overdue situation, in total and per account type (always current, whatever month is selected). */
export interface PlatformOverdue extends FinancialOverdue {
  byAccountType: Record<PlatformRole, FinancialOverdue>;
}
