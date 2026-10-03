import type { ErrorMapping } from '@/_types/errorMapping';
import { TOO_MANY_REQUESTS } from '@/_lib/safeActionError';

export const STUDENT_NOT_FOUND_MESSAGE = 'Aluno não encontrado.';
export const STUDENT_ALREADY_REGISTERED_MESSAGE =
  'Você já cadastrou um aluno com este e-mail.';
export const ACCOUNT_NOT_FOUND_MESSAGE =
  'Não encontramos uma conta ativa com este e-mail.';
export const SELF_REGISTRATION_MESSAGE =
  'Você não pode se cadastrar como seu próprio aluno.';
export const EMAIL_LOCKED_MESSAGE =
  'O e-mail de um aluno com conta não pode ser alterado.';
export const ASSESSMENT_NOT_FOUND_MESSAGE = 'Avaliação não encontrada.';

export const STUDENT_VALIDATION: ErrorMapping = {
  status: 400,
  message: 'Verifique os dados informados e tente novamente.',
};

export const STUDENT_LOOKUP_ERRORS: ErrorMapping[] = [
  TOO_MANY_REQUESTS,
  STUDENT_VALIDATION,
];

export const STUDENT_WRITE_ERRORS: ErrorMapping[] = [
  { status: 400, code: 'email_locked', message: EMAIL_LOCKED_MESSAGE },
  STUDENT_VALIDATION,
  { status: 404, message: STUDENT_NOT_FOUND_MESSAGE },
  {
    status: 409,
    code: 'student_already_registered',
    message: STUDENT_ALREADY_REGISTERED_MESSAGE,
  },
];

export const ASSESSMENT_WRITE_ERRORS: ErrorMapping[] = [
  STUDENT_VALIDATION,
  {
    status: 404,
    code: 'assessment_not_found',
    message: ASSESSMENT_NOT_FOUND_MESSAGE,
  },
  { status: 404, message: STUDENT_NOT_FOUND_MESSAGE },
];
