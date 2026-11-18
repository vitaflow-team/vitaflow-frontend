import type { PlatformRole } from './platformRole';

/** One delinquent subscriber: the only fields the platform list may show (ADR-005); never an individual payment. */
export interface PlatformDelinquentRow {
  userId: string;
  name: string;
  accountType: PlatformRole;
  planName: string;
  totalOwedCents: number;
  oldestDaysOverdue: number;
}
