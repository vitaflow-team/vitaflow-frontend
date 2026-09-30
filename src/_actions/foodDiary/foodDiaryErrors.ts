import type { ErrorMapping } from '@/_types/errorMapping';

export const ESTIMATE_UNAVAILABLE: ErrorMapping = {
  status: 503,
  message: 'Não foi possível estimar as calorias. Informe o valor manualmente.',
};

export const INVALID_MEAL: ErrorMapping = {
  status: 400,
  message: 'Verifique a descrição e as calorias informadas.',
};

export const MEAL_NOT_FOUND: ErrorMapping = {
  status: 404,
  message: 'Refeição não encontrada. Atualize a página.',
};
