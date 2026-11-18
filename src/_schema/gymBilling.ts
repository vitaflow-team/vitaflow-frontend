import { BILLING_LIMITS } from '@/_constants/billingLimits';
import { GYM_BILLING_LIMITS } from '@/_constants/gymBilling';
import { taxIdSchema } from '@/_schema/billing';
import { z } from 'zod';

export const dueDaySchema = z
  .number()
  .int()
  .min(GYM_BILLING_LIMITS.dueDayMin)
  .max(GYM_BILLING_LIMITS.dueDayMax);

export const feeAmountCentsSchema = z
  .number()
  .int()
  .min(BILLING_LIMITS.amountMinCents)
  .max(BILLING_LIMITS.amountMaxCents);

/** The fee terms sent with a plan link; the amount defaults to the plan price on the backend. */
export const billingTermsSchema = z.object({
  dueDay: dueDaySchema,
  amountCents: feeAmountCentsSchema.optional(),
  cpfCnpj: taxIdSchema.optional(),
});
export type BillingTermsInput = z.input<typeof billingTermsSchema>;

export const assignAccessPlanSchema = z.object({
  clientId: z.string(),
  accessPlanId: z.string(),
  billing: billingTermsSchema.optional(),
});
export type AssignAccessPlanInput = z.input<typeof assignAccessPlanSchema>;

/** At least one of the two: the backend changes only what is sent. */
export const changeBillingTermsSchema = z
  .object({
    clientId: z.string(),
    dueDay: dueDaySchema.optional(),
    amountCents: feeAmountCentsSchema.optional(),
  })
  .refine(
    ({ dueDay, amountCents }) =>
      dueDay !== undefined || amountCents !== undefined,
    { message: 'Informe o novo dia de vencimento ou o novo valor.' }
  );
export type ChangeBillingTermsInput = z.input<typeof changeBillingTermsSchema>;

export const activationItemSchema = z.object({
  clientId: z.string(),
  dueDay: dueDaySchema,
  amountCents: feeAmountCentsSchema.optional(),
});
export type ActivationItemInput = z.input<typeof activationItemSchema>;

export const activateBillingSchema = z.object({
  items: z
    .array(activationItemSchema)
    .min(1, 'Selecione ao menos um aluno.')
    .max(
      GYM_BILLING_LIMITS.bulkActivationMaxItems,
      `Selecione no máximo ${GYM_BILLING_LIMITS.bulkActivationMaxItems} alunos por vez.`
    ),
});
export type ActivateBillingInput = z.input<typeof activateBillingSchema>;
