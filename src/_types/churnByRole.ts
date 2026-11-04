import type { PlatformRole } from '@/_types/platformRole';

/** Cancellations for one role this month — never summed across roles (ADR-003). */
export interface ChurnByRole {
  role: PlatformRole;
  canceledThisMonth: number;
}
