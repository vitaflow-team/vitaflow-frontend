import type { PlatformRole } from '@/_types/platformRole';

/** Registered-user counts for one role, split by plan (ADR-002). */
export interface RegisteredByRole {
  role: PlatformRole;
  free: number;
  premium: number;
  newThisMonth: number;
}
