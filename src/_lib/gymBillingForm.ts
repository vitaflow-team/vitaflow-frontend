import { BILLING_LIMITS } from '@/_constants/billingLimits';
import { GYM_BILLING_LIMITS } from '@/_constants/gymBilling';
import { amountToCents, normalizeAmountInput } from '@/_lib/currency';
import { isValidTaxId, taxIdDigits } from '@/_lib/taxId';
import type {
  AssignAccessPlanInput,
  ChangeBillingTermsInput,
} from '@/_schema/gymBilling';
import type { BillingFormValues } from '@/_types/billingFormValues';
import type { PreparedAssign } from '@/_types/preparedAssign';
import type { PreparedTermsChange } from '@/_types/preparedTermsChange';

/** The due days a student can have: 1 to 28, so every month has them. */
export const DUE_DAYS: number[] = Array.from(
  { length: GYM_BILLING_LIMITS.dueDayMax },
  (_, index) => index + GYM_BILLING_LIMITS.dueDayMin
);

/** Today's day of the month, capped at 28 (`today` is a Brasília `YYYY-MM-DD`). */
export function defaultDueDay(today: string): number {
  return Math.min(Number(today.slice(8, 10)), GYM_BILLING_LIMITS.dueDayMax);
}

/** A catalog price in reais (a decimal that may arrive as text) as integer cents. */
export function planPriceCents(referencePrice: string | number): number {
  return Math.round(Number(referencePrice) * 100);
}

/** Cents as the amount field shows them: `14990` becomes `149,90`. */
export function centsToAmountInput(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',');
}

const AMOUNT_MESSAGE = `Informe um valor entre R$ ${centsToAmountInput(
  BILLING_LIMITS.amountMinCents
)} e R$ ${centsToAmountInput(BILLING_LIMITS.amountMaxCents)}.`;

/** The amount typed in the field as cents, or a message saying what is wrong with it. */
export function parseFeeAmount(
  text: string
): { cents: number } | { message: string } {
  const normalized = normalizeAmountInput(text);
  if (normalized === undefined) {
    return { message: 'Informe um valor numérico válido, por exemplo 149,90.' };
  }
  const cents = amountToCents(normalized);
  const inRange =
    cents >= BILLING_LIMITS.amountMinCents &&
    cents <= BILLING_LIMITS.amountMaxCents;
  return inRange ? { cents } : { message: AMOUNT_MESSAGE };
}

/**
 * The input of the assign action for the form as it stands: a plain link when
 * the monthly fee is off, otherwise the fee terms. A tax ID is sent only when
 * one was typed, and only when it is valid.
 */
export function prepareAssign(params: {
  clientId: string;
  accessPlanId: string;
  billing: BillingFormValues | null;
}): PreparedAssign {
  const { clientId, accessPlanId, billing } = params;
  const base: AssignAccessPlanInput = { clientId, accessPlanId };
  if (!billing) return { ok: true, input: base };

  const amount = parseFeeAmount(billing.amountText);
  if ('message' in amount) return { ok: false, message: amount.message };

  const typedTaxId = billing.cpfCnpj.trim();
  if (typedTaxId !== '' && !isValidTaxId(typedTaxId)) {
    return { ok: false, message: 'Informe um CPF ou CNPJ válido.' };
  }

  return {
    ok: true,
    input: {
      ...base,
      billing: {
        dueDay: billing.dueDay,
        amountCents: amount.cents,
        ...(typedTaxId !== '' && { cpfCnpj: taxIdDigits(typedTaxId) }),
      },
    },
  };
}

/** What `changeBillingTerms` needs: only the terms that were filled in. */
export function prepareTermsChange(params: {
  clientId: string;
  dueDay: number | null;
  amountText: string;
}): PreparedTermsChange {
  const { clientId, dueDay, amountText } = params;
  const typedAmount = amountText.trim();
  if (dueDay === null && typedAmount === '') {
    return {
      ok: false,
      message: 'Informe o novo dia de vencimento ou o novo valor.',
    };
  }

  const input: ChangeBillingTermsInput = { clientId };
  if (dueDay !== null) input.dueDay = dueDay;
  if (typedAmount === '') return { ok: true, input };

  const amount = parseFeeAmount(typedAmount);
  if ('message' in amount) return { ok: false, message: amount.message };
  return { ok: true, input: { ...input, amountCents: amount.cents } };
}
