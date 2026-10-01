import type { ErrorMapping } from '@/_types/errorMapping';

/** Answers every professional-discovery route can give, whatever the action. */
export const PROFESSIONAL_DISCOVERY_ERRORS: ErrorMapping[] = [
  { status: 401, message: 'Ação não permitida.' },
  {
    status: 403,
    message:
      'Apenas nutricionistas e educadores físicos podem acessar este recurso.',
  },
  { status: 404, message: 'Profissional não encontrado.' },
];

// US-004.EC-1: requesting a professional a second time while a request is
// still pending is refused with a clear message, not a silent duplicate.
export const DUPLICATE_PENDING_REQUEST: ErrorMapping = {
  status: 409,
  message: 'Você já tem uma solicitação pendente para este profissional.',
};

// Covers both the concurrent-double-accept race (US-008.EC-1) and accepting
// or declining a request someone else already decided.
export const REQUEST_NOT_PENDING: ErrorMapping = {
  status: 404,
  message: 'Solicitação não encontrada ou já respondida.',
};

// ADR-003: no before/after imagery or outcome-guarantee language.
export const CONTENT_REJECTED: ErrorMapping = {
  status: 400,
  message:
    'Conteúdo não permitido: remova imagens de antes/depois ou garantias de resultado.',
};
