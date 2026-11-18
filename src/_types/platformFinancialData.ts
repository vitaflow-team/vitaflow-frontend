import type { LoadFailure } from './loadFailure';
import type { PlatformDelinquentsFailure } from './platformDelinquentsFailure';
import type { PlatformDelinquentsPage } from './platformDelinquentsPage';
import type { PlatformSummary } from './platformSummary';

/** What the backoffice page reads: the list first, because its tier decides whether the summary is read at all. */
export interface PlatformFinancialData {
  delinquents: PlatformDelinquentsPage | PlatformDelinquentsFailure;
  /** `null` when the tier is not ADMIN (or the list failed): the summary was never requested. */
  summary: PlatformSummary | LoadFailure | null;
}
