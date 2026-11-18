import type { AssignAccessPlanInput } from '@/_schema/gymBilling';

/** The assign action input for the form as it stands, or what is wrong with it. */
export type PreparedAssign =
  | { ok: true; input: AssignAccessPlanInput }
  | { ok: false; message: string };
