import type { ErrorMapping } from '@/_types/errorMapping';

/** Answers every backoffice route can give, whatever the action. */
export const BACKOFFICE_ERRORS: ErrorMapping[] = [
  { status: 403, message: 'Ação restrita à equipe Vita Flow.' },
  { status: 404, message: 'Exercício não encontrado. Atualize a página.' },
];

export const INVALID_EXERCISE: ErrorMapping = {
  status: 400,
  message: 'Verifique os dados do exercício e tente novamente.',
};

// Another reviewer decided the submission first; the queue refresh that
// follows shows its current state (US-008.EC-2, US-009.EC-1).
export const ALREADY_REVIEWED: ErrorMapping = {
  status: 409,
  message: 'Esta sugestão já foi revisada por outra pessoa da equipe.',
};
