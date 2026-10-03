import type { ErrorMapping } from '@/_types/errorMapping';
import { TOO_MANY_REQUESTS } from '@/_lib/safeActionError';

export const FIXED_TIME_NOT_FOUND_MESSAGE =
  'Este horário não existe mais. Atualize a página.';
export const STUDENT_GONE_MESSAGE = 'Aluno não encontrado.';
export const FIXED_TIME_LIMIT_MESSAGE =
  'Um aluno pode ter no máximo 14 horários fixos.';

const VALIDATION: ErrorMapping = {
  status: 400,
  message: 'Verifique os dados do horário e tente de novo.',
};

/** Failures the schedule forms show as a message; a conflict is an outcome, not one of these. */
export const SCHEDULE_WRITE_ERRORS: ErrorMapping[] = [
  {
    status: 400,
    code: 'link_not_allowed',
    message: 'Um horário presencial não aceita link.',
  },
  VALIDATION,
  {
    status: 404,
    code: 'fixed_time_not_found',
    message: FIXED_TIME_NOT_FOUND_MESSAGE,
  },
  { status: 404, code: 'student_not_found', message: STUDENT_GONE_MESSAGE },
  { status: 409, code: 'fixed_time_limit', message: FIXED_TIME_LIMIT_MESSAGE },
  TOO_MANY_REQUESTS,
];

export const SCHEDULE_LOAD_ERRORS: ErrorMapping[] = [TOO_MANY_REQUESTS];
