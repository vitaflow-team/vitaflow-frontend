import type { ErrorMapping } from '@/_types/errorMapping';

export const DUPLICATE_PATIENT_EMAIL_MESSAGE =
  'Você já tem um paciente cadastrado com este e-mail.';
export const PATIENT_INVALID_MESSAGE =
  'Informe o nome e pelo menos um telefone ou e-mail.';

export const PATIENT_ERRORS: ErrorMapping[] = [
  {
    status: 409,
    code: 'duplicate_patient_email',
    message: DUPLICATE_PATIENT_EMAIL_MESSAGE,
  },
  { status: 400, code: 'patient_invalid', message: PATIENT_INVALID_MESSAGE },
];
