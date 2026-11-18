import type { Invoice } from './billing';
import type { RecurringBilling } from './recurringBilling';

/** `POST /academia/students/:id/access-plan`: `billing` and `firstInvoice` are `null` on a plain assign. */
export interface AssignAccessPlanResult {
  plan: { id: string };
  billing: RecurringBilling | null;
  firstInvoice: Invoice | null;
}
