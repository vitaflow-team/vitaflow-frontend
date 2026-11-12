export type AccessPlanStatus = 'NO_PLAN' | 'VALID' | 'EXPIRED' | 'EXHAUSTED';

export type AccessPlanValidityType = 'DAYS' | 'VISITS';

/** The student's current plan at one gym, or the honest "nothing assigned"
 * state. remaining is populated only when status is VALID. */
export interface CurrentAccessPlan {
  status: AccessPlanStatus;
  planName: string | null;
  validityType: AccessPlanValidityType | null;
  validityValue: number | null;
  remaining: number | null;
}

/** One past assignment at a gym, newest-assignedAt-first (already ordered
 * by the backend). */
export interface ArchivedAccessPlan {
  id: string;
  planName: string;
  validityType: AccessPlanValidityType;
  validityValue: number;
  assignedAt: string;
  endedAt: string;
}

/** One gym membership, as the student sees it (US-001/US-002). */
export interface AcademiaMembership {
  academiaId: string;
  academiaName: string;
  currentPlan: CurrentAccessPlan;
  history: ArchivedAccessPlan[];
}
