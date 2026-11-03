import { BILLING_LIMITS } from '@/_constants/billingLimits';
import { amountToCents, normalizeAmountInput } from '@/_lib/currency';
import {
  isCompetenceInRange,
  isDueDateInRange,
  isNotFutureDate,
} from '@/_lib/billingDates';
import { isValidTaxId, taxIdDigits } from '@/_lib/taxId';
import { z } from 'zod';

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const AMOUNT_RANGE_MESSAGE = `Informe um valor entre R$ ${formatBRL(
  BILLING_LIMITS.amountMinCents
)} e R$ ${formatBRL(BILLING_LIMITS.amountMaxCents)}.`;

/** Accepts "180,00" or "180.00"; the output is a dot-decimal string, as the backend expects. */
export const amountSchema = z
  .string()
  .trim()
  .min(1, 'Informe o valor da cobrança.')
  .transform(value => normalizeAmountInput(value))
  .refine(value => value !== undefined, {
    message: 'Informe um valor numérico válido, por exemplo 180,00.',
  })
  .refine(
    value => {
      if (value === undefined) return true; // already reported above
      const cents = amountToCents(value);
      return (
        cents >= BILLING_LIMITS.amountMinCents &&
        cents <= BILLING_LIMITS.amountMaxCents
      );
    },
    { message: AMOUNT_RANGE_MESSAGE }
  )
  .transform(value => value as string);

export const dueDateSchema = z
  .string()
  .min(1, 'Informe a data de vencimento.')
  .refine(
    value => isDueDateInRange(value, BILLING_LIMITS.dueDateMaxDaysAhead),
    {
      message: `A data de vencimento deve ser de hoje até ${BILLING_LIMITS.dueDateMaxDaysAhead} dias à frente.`,
    }
  );

export const competenceYearSchema = z.number().int();
export const competenceMonthSchema = z.number().int().min(1).max(12);

export const competenceSchema = z
  .object({
    competenceYear: competenceYearSchema,
    competenceMonth: competenceMonthSchema,
  })
  .refine(
    ({ competenceYear, competenceMonth }) =>
      isCompetenceInRange(
        competenceYear,
        competenceMonth,
        BILLING_LIMITS.competenceMonthsWindow
      ),
    {
      message: `A competência deve estar dentro de ${BILLING_LIMITS.competenceMonthsWindow} meses do mês atual.`,
      path: ['competenceMonth'],
    }
  );

export const taxIdSchema = z
  .string()
  .trim()
  .min(1, 'Informe o CPF ou CNPJ do aluno.')
  .refine(value => isValidTaxId(value), {
    message: 'Informe um CPF ou CNPJ válido.',
  })
  .transform(value => taxIdDigits(value));

export const noteSchema = z
  .string()
  .trim()
  .max(
    BILLING_LIMITS.manualNoteMaxLength,
    `A nota pode ter no máximo ${BILLING_LIMITS.manualNoteMaxLength} caracteres.`
  )
  .optional();

export const paidOnSchema = z
  .string()
  .min(1, 'Informe a data do pagamento.')
  .refine(value => isNotFutureDate(value), {
    message: 'A data de pagamento não pode ser no futuro.',
  });

export const apiKeySchema = z
  .string()
  .trim()
  .min(
    BILLING_LIMITS.apiKeyMinLength,
    `A chave deve ter entre ${BILLING_LIMITS.apiKeyMinLength} e ${BILLING_LIMITS.apiKeyMaxLength} caracteres.`
  )
  .max(
    BILLING_LIMITS.apiKeyMaxLength,
    `A chave deve ter entre ${BILLING_LIMITS.apiKeyMinLength} e ${BILLING_LIMITS.apiKeyMaxLength} caracteres.`
  );

export const connectAccountSchema = z.object({
  apiKey: apiKeySchema,
});
export type ConnectAccountFormValues = z.input<typeof connectAccountSchema>;
export type ConnectAccountData = z.output<typeof connectAccountSchema>;

export const createInvoiceSchema = z
  .object({
    competenceYear: competenceYearSchema,
    competenceMonth: competenceMonthSchema,
    amount: amountSchema,
    dueDate: dueDateSchema,
    cpfCnpj: taxIdSchema.optional(),
  })
  .refine(
    ({ competenceYear, competenceMonth }) =>
      isCompetenceInRange(
        competenceYear,
        competenceMonth,
        BILLING_LIMITS.competenceMonthsWindow
      ),
    {
      message: `A competência deve estar dentro de ${BILLING_LIMITS.competenceMonthsWindow} meses do mês atual.`,
      path: ['competenceMonth'],
    }
  );
export type CreateInvoiceFormValues = z.input<typeof createInvoiceSchema>;
export type CreateInvoiceData = z.output<typeof createInvoiceSchema>;

export const updateInvoiceSchema = z.object({
  amount: amountSchema.optional(),
  dueDate: dueDateSchema.optional(),
});
export type UpdateInvoiceFormValues = z.input<typeof updateInvoiceSchema>;
export type UpdateInvoiceData = z.output<typeof updateInvoiceSchema>;

export const markPaidSchema = z.object({
  paidOn: paidOnSchema,
  note: noteSchema,
});
export type MarkPaidFormValues = z.input<typeof markPaidSchema>;
export type MarkPaidData = z.output<typeof markPaidSchema>;

export const setTaxIdSchema = z.object({
  cpfCnpj: taxIdSchema,
});
export type SetTaxIdFormValues = z.input<typeof setTaxIdSchema>;
export type SetTaxIdData = z.output<typeof setTaxIdSchema>;
