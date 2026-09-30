import type { ErrorMapping } from '@/_types/errorMapping';

export const PREMIUM_REQUIRED: ErrorMapping = {
  status: 402,
  message: 'Regeneração requer o plano Premium.',
};

export const NOT_ENOUGH_EXERCISES: ErrorMapping = {
  status: 422,
  message: 'Não há exercícios suficientes para os critérios informados.',
};

export const INVALID_ANSWER: ErrorMapping = {
  status: 400,
  message: 'Verifique a resposta e tente novamente.',
};

export const WORKOUT_NOT_FOUND: ErrorMapping = {
  status: 404,
  message: 'Treino não encontrado. Atualize a página.',
};
