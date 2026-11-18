import type { FinancialMonthTotals } from './financialMonthTotals';
import type { PlatformRole } from './platformRole';

/** The month figures per account type; every type is always present. */
export type PlatformAccountTotals = Record<PlatformRole, FinancialMonthTotals>;
