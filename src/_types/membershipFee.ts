import type { MembershipFeeStatus } from './membershipFeeStatus';

/** One monthly fee of the student's own gym membership (`GET /me/academia`, `fees`). */
export interface MembershipFee {
  id: string;
  amountCents: number;
  /** `YYYY-MM-DD`. */
  dueDate: string;
  status: MembershipFeeStatus;
  paymentUrl: string | null;
}
