import { z } from 'zod';

const BRAZILIAN_PHONE = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
const PATIENT_NAME_MAX_LENGTH = 255;

/** Text typed in an optional field: blank means "not provided". */
function blankToUndefined(value: unknown): unknown {
  return typeof value === 'string' && value.trim() === '' ? undefined : value;
}

const patientName = z
  .string()
  .trim()
  .min(1, 'O nome é obrigatório.')
  .max(
    PATIENT_NAME_MAX_LENGTH,
    `O nome deve ter no máximo ${PATIENT_NAME_MAX_LENGTH} caracteres.`
  );

const patientEmail = z.preprocess(
  blankToUndefined,
  z
    .string()
    .trim()
    .max(254, 'E-mail muito longo.')
    .pipe(z.email('E-mail inválido.'))
    .transform(value => value.toLowerCase())
    .optional()
);

const patientPhone = z.preprocess(
  blankToUndefined,
  z
    .string()
    .trim()
    .regex(BRAZILIAN_PHONE, 'Telefone inválido. Use DDD e número.')
    .optional()
);

/**
 * Registering a patient: name is required, and at least one of email/phone
 * (US-001.EC-3) — mirrors `CreateNutritionistPatientDTO`'s own contract.
 */
export const registerPatientSchema = z
  .object({
    name: patientName,
    email: patientEmail,
    phone: patientPhone,
  })
  .refine(data => Boolean(data.email || data.phone), {
    message: 'Informe pelo menos um telefone ou e-mail.',
    path: ['email'],
  });

export type RegisterPatientFormInput = z.input<typeof registerPatientSchema>;
export type RegisterPatientData = z.output<typeof registerPatientSchema>;

/** What the register form holds while typing: every value is text. */
export interface PatientFormValues {
  name: string;
  email: string;
  phone: string;
}
