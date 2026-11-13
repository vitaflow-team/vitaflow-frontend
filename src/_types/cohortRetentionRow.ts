import type { PlatformRole } from '@/_types/platformRole';

/** One cohort-month × role × plan cell of the retention grid (cohort-ltv-analysis ADR-007). */
export interface CohortRetentionRow {
  /** "yyyy-MM", UTC. */
  cohortMonth: string;
  role: PlatformRole;
  plan: 'FREE' | 'PREMIUM';
  cohortSize: number;
  /** Index = months since signup. `null` means not yet elapsed — never 0. */
  retainedPercentByMonth: (number | null)[];
}
