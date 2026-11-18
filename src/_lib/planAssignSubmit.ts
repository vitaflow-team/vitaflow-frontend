import { prepareAssign } from '@/_lib/gymBillingForm';
import type { BillingFormValues } from '@/_types/billingFormValues';
import type { PlanAssignOutcome } from '@/_types/planAssignOutcome';
import type { AssignAccessPlanInput } from '@/_schema/gymBilling';

/** The assign action as the form runs it: the bound `execute`, or a stand-in in tests. */
export type AssignExecutor = (
  input: AssignAccessPlanInput
) => Promise<readonly [unknown, { message: string; data?: unknown } | null]>;

/**
 * Links the plan: the form is checked first, then the action runs with
 * `{ clientId, accessPlanId, billing? }`. A missing tax ID in the answer is
 * flagged so the form can ask for it.
 */
export async function submitPlanAssign(
  execute: AssignExecutor,
  params: {
    clientId: string;
    accessPlanId: string;
    billing: BillingFormValues | null;
  }
): Promise<PlanAssignOutcome> {
  const prepared = prepareAssign(params);
  if (!prepared.ok) {
    return { done: false, message: prepared.message, needsTaxId: false };
  }

  const [, error] = await execute(prepared.input);
  if (!error) return { done: true };
  return {
    done: false,
    message: error.message,
    needsTaxId: error.data === 'tax_id_required',
  };
}
