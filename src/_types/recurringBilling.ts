/** A student's monthly gym billing, as `PATCH /academia/students/:id/billing` and the assign answer return it. */
export interface RecurringBilling {
  clientId: string;
  accessPlanId: string;
  dueDay: number;
  amountCents: number;
  customAmount: boolean;
  status: 'ACTIVE' | 'ENDED';
  startedAt: string;
}
