import type { ErrorMapping } from '@/_types/errorMapping';

export const CLIENT_NOT_FOUND_MESSAGE = 'Paciente não encontrado.';
export const DRAFT_NOT_FOUND_MESSAGE =
  'Rascunho de plano alimentar não encontrado.';
export const EMPTY_PLAN_MESSAGE =
  'Defina ao menos uma refeição antes de publicar.';
export const VERSION_NOT_FOUND_MESSAGE =
  'Versão do plano alimentar não encontrada.';
export const SOURCE_DAY_NOT_FOUND_MESSAGE = 'Dia de origem não encontrado.';
export const SOURCE_DAY_FOREIGN_MESSAGE =
  'O dia de origem pertence a outro paciente.';
export const MEAL_TEXT_TOO_LONG_MESSAGE =
  'O texto de uma das refeições é muito longo.';

export const MEAL_PLAN_ERRORS: ErrorMapping[] = [
  { status: 404, code: 'client_not_found', message: CLIENT_NOT_FOUND_MESSAGE },
  {
    status: 404,
    code: 'meal_plan_draft_not_found',
    message: DRAFT_NOT_FOUND_MESSAGE,
  },
  { status: 400, code: 'empty_plan', message: EMPTY_PLAN_MESSAGE },
  {
    status: 404,
    code: 'meal_plan_version_not_found',
    message: VERSION_NOT_FOUND_MESSAGE,
  },
  {
    status: 404,
    code: 'source_day_not_found',
    message: SOURCE_DAY_NOT_FOUND_MESSAGE,
  },
  {
    status: 403,
    code: 'source_day_foreign',
    message: SOURCE_DAY_FOREIGN_MESSAGE,
  },
  {
    status: 400,
    code: 'meal_text_too_long',
    message: MEAL_TEXT_TOO_LONG_MESSAGE,
  },
];
