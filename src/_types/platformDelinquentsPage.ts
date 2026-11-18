import type { BackofficeTier } from './backofficeStaff';
import type { PlatformBandCounts } from './platformBandCounts';
import type { PlatformDelinquentRow } from './platformDelinquentRow';

/** `GET /backoffice/financial-health/delinquents`: the same payload for both tiers, never a revenue total. */
export interface PlatformDelinquentsPage {
  tier: BackofficeTier;
  bandCounts: PlatformBandCounts;
  items: PlatformDelinquentRow[];
  page: number;
  pageSize: number;
  total: number;
}
