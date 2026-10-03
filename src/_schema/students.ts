import {
  STUDENT_MAX_AGE_YEARS,
  STUDENT_MIN_AGE_YEARS,
  STUDENT_NAME_MAX_LENGTH,
} from '@/_constants/assessmentFields';
import { ageInYears, todayInBrazil } from '@/_lib/studentsDates';
import { z } from 'zod';

const BRAZILIAN_PHONE = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Text typed in an optional field: blank means "not provided". */
function blankToUndefined(value: unknown): unknown {
  return typeof value === 'string' && value.trim() === '' ? undefined : value;
}

export const studentEmailSchema = z
  .string()
  .trim()
  .min(1, 'Informe o e-mail.')
  .max(254, 'E-mail muito longo.')
  .pipe(z.email('E-mail inválido.'))
  .transform(value => value.toLowerCase());

const studentName = z
  .string()
  .trim()
  .min(1, 'O nome é obrigatório.')
  .max(
    STUDENT_NAME_MAX_LENGTH,
    `O nome deve ter no máximo ${STUDENT_NAME_MAX_LENGTH} caracteres.`
  );

const studentPhone = z.preprocess(
  blankToUndefined,
  z
    .string()
    .trim()
    .regex(BRAZILIAN_PHONE, 'Telefone inválido. Use DDD e número.')
    .optional()
);

const studentBirthDate = z.preprocess(
  blankToUndefined,
  z
    .string()
    .trim()
    .refine(value => ISO_DAY.test(value), 'Data inválida.')
    .refine(value => value <= todayInBrazil(), 'A data não pode ser futura.')
    .refine(value => {
      const age = ageInYears(value);
      return age === null || age >= STUDENT_MIN_AGE_YEARS;
    }, `O aluno deve ter pelo menos ${STUDENT_MIN_AGE_YEARS} anos.`)
    .refine(value => {
      const age = ageInYears(value);
      return age === null || age <= STUDENT_MAX_AGE_YEARS;
    }, 'Data de nascimento inválida.')
    .optional()
);

/** Registering a student without an account: name and e-mail are required. */
export const registerStudentSchema = z.object({
  name: studentName,
  email: studentEmailSchema,
  phone: studentPhone,
  birthDate: studentBirthDate,
});

/** Editing a student: the same fields; the e-mail is sent only when editable. */
export const editStudentSchema = z.object({
  name: studentName,
  email: studentEmailSchema.optional(),
  phone: studentPhone,
  birthDate: studentBirthDate,
});

export type RegisterStudentFormInput = z.input<typeof registerStudentSchema>;
export type RegisterStudentData = z.output<typeof registerStudentSchema>;
export type EditStudentData = z.output<typeof editStudentSchema>;

/** Input of the `createStudent` action. */
export const createStudentInputSchema = z.object({
  name: z.string().trim().min(1).max(STUDENT_NAME_MAX_LENGTH).optional(),
  email: studentEmailSchema,
  phone: studentPhone,
  birthDate: studentBirthDate,
  linkExistingAccount: z.boolean(),
});

export const lookupInputSchema = z.object({ email: studentEmailSchema });

/** What the register and edit forms hold while typing: every value is text. */
export interface StudentFormValues {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
}
