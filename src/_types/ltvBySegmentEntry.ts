import type { PlatformRole } from '@/_types/platformRole';

/** Projected LTV (ARPU ÷ monthly churn) for one role's Premium segment (cohort-ltv-analysis ADR-001). */
export interface LtvBySegmentEntry {
  role: PlatformRole;
  /** `null` means not enough data (zero churn or zero active Premium users) — never a literal zero value. */
  ltv: number | null;
}
