import { z } from 'zod';

export const academiaMemberEmailSchema = z
  .string()
  .trim()
  .min(1, 'Informe o e-mail.')
  .max(254, 'E-mail muito longo.')
  .pipe(z.email('E-mail inválido.'))
  .transform(value => value.toLowerCase());

export const inviteAcademiaMemberSchema = z.object({
  email: academiaMemberEmailSchema,
  kind: z.enum(['EMPLOYMENT', 'RECEPTIONIST']),
});

export type InviteAcademiaMemberData = z.output<
  typeof inviteAcademiaMemberSchema
>;

const coercedPositiveInt = z
  .union([z.string(), z.number()])
  .transform(value => Number(value))
  .pipe(
    z
      .number()
      .int('Use um número inteiro.')
      .positive('A validade deve ser maior que zero.')
  );

const coercedNonNegative = z
  .union([z.string(), z.number()])
  .transform(value => Number(value))
  .pipe(z.number().min(0, 'O valor de referência não pode ser negativo.'));

export const accessPlanSchema = z.object({
  name: z.string().trim().min(1, 'Informe um nome para o plano.').max(120),
  validityType: z.enum(['DAYS', 'VISITS']),
  validityValue: coercedPositiveInt,
  referencePrice: coercedNonNegative,
});

export type AccessPlanFormInput = z.input<typeof accessPlanSchema>;
export type AccessPlanFormData = z.output<typeof accessPlanSchema>;
