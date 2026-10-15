export type AccessPlanStatus = 'NO_PLAN' | 'VALID' | 'EXPIRED' | 'EXHAUSTED';

export interface CurrentAccessPlan {
  plan: {
    validityType: 'DAYS' | 'VISITS';
    validityValue: number;
    expiresAt: string | null;
    assignedAt: string;
  } | null;
  status: AccessPlanStatus;
  remaining: number | null;
}
