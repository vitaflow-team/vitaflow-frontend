/** A student with an active plan and no monthly billing yet (`GET .../billing/eligible`). */
export interface EligibleStudent {
  clientId: string;
  name: string;
  planName: string;
  /** What the first fee costs by default: the plan price. */
  amountCents: number;
  hasTaxId: boolean;
}
