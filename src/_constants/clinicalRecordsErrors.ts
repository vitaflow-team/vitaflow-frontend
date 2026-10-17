import type { ErrorMapping } from '@/_types/errorMapping';

export const TEMPLATE_NOT_FOUND_MESSAGE = 'Modelo não encontrado.';
export const TEMPLATE_EMPTY_MESSAGE = 'Adicione pelo menos um campo ao modelo.';
export const MISSING_OPTIONS_MESSAGE =
  'Um campo de múltipla escolha precisa de pelo menos uma opção.';

export const TEMPLATE_ERRORS: ErrorMapping[] = [
  {
    status: 404,
    code: 'template_not_found',
    message: TEMPLATE_NOT_FOUND_MESSAGE,
  },
  { status: 400, code: 'template_empty', message: TEMPLATE_EMPTY_MESSAGE },
  { status: 400, code: 'missing_options', message: MISSING_OPTIONS_MESSAGE },
];

export const CLIENT_NOT_FOUND_MESSAGE = 'Paciente não encontrado.';
export const RECORD_NOT_FOUND_MESSAGE = 'Registro não encontrado.';
export const REQUIRED_FIELD_MISSING_MESSAGE =
  'Preencha todos os campos obrigatórios.';
export const IMPLAUSIBLE_VALUE_MESSAGE = 'Valor fora do intervalo plausível.';
export const INVALID_OPTION_MESSAGE = 'Opção inválida para este campo.';
export const DECLARATION_REQUIRED_MESSAGE =
  'Aceite a declaração de responsabilidade sobre dados de saúde antes de registrar o primeiro prontuário.';

export const FORM_RECORD_ERRORS: ErrorMapping[] = [
  { status: 404, code: 'client_not_found', message: CLIENT_NOT_FOUND_MESSAGE },
  {
    status: 404,
    code: 'template_not_found',
    message: TEMPLATE_NOT_FOUND_MESSAGE,
  },
  {
    status: 404,
    code: 'form_record_not_found',
    message: RECORD_NOT_FOUND_MESSAGE,
  },
  {
    status: 400,
    code: 'required_field_missing',
    message: REQUIRED_FIELD_MISSING_MESSAGE,
  },
  {
    status: 400,
    code: 'implausible_value',
    message: IMPLAUSIBLE_VALUE_MESSAGE,
  },
  { status: 400, code: 'invalid_option', message: INVALID_OPTION_MESSAGE },
];
