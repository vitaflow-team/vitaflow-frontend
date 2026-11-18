import type { ChangeBillingTermsInput } from '@/_schema/gymBilling';

/** The change-terms action input for the form as it stands, or what is wrong with it. */
export type PreparedTermsChange =
  | { ok: true; input: ChangeBillingTermsInput }
  | { ok: false; message: string };
