import type { ErrorMapping } from '@/_types/errorMapping';

/** Answers every /scheduling route can give, whatever the action. */
export const SCHEDULING_ERRORS: ErrorMapping[] = [
  { status: 401, message: 'Ação não permitida.' },
];

export const NOT_ELIGIBLE: ErrorMapping = {
  status: 403,
  message:
    'Você precisa ter um vínculo ativo com este profissional para agendar.',
};

// US-006.EC-1: the backend's own, already-safe Portuguese message for the
// lost-race case — shown to the user as-is, then the slot list is refreshed.
export const SLOT_JUST_TAKEN: ErrorMapping = {
  status: 409,
  message: 'Este horário acabou de ser reservado por outra pessoa.',
};

export const SLOT_NOT_FOUND: ErrorMapping = {
  status: 404,
  message: 'Horário não encontrado.',
};

export const END_BEFORE_START: ErrorMapping = {
  status: 400,
  message: 'O horário final deve ser depois do horário inicial.',
};
