import type { DelinquentsPage } from './delinquentsPage';
import type { FinancialHealthSummary } from './financialHealthSummary';
import type { LoadFailure } from './loadFailure';

/** Everything a panel page needs, each part failing on its own. */
export interface FinancialPanelData {
  summary: FinancialHealthSummary | LoadFailure;
  delinquents: DelinquentsPage | LoadFailure;
  /** Whether the owner's plan can bill; `null` when it is not known. */
  canBill: boolean | null;
}
