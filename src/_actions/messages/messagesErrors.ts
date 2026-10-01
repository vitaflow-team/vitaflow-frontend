import type { ErrorMapping } from '@/_types/errorMapping';

/** Answers every /conversations route can give, whatever the action. */
export const MESSAGES_ERRORS: ErrorMapping[] = [
  { status: 401, message: 'Ação não permitida.' },
];

// US-004: the backend's own, already-safe Portuguese message for an
// ineligible send target (no active Client relationship either way).
export const NOT_ELIGIBLE: ErrorMapping = {
  status: 403,
  message:
    'Você só pode enviar mensagens para um profissional ou aluno com quem tem um vínculo ativo.',
};

export const CONVERSATION_NOT_FOUND: ErrorMapping = {
  status: 404,
  message: 'Conversa não encontrada.',
};
