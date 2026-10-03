import type { ErrorMapping } from '@/_types/errorMapping';
import { TOO_MANY_REQUESTS } from '@/_lib/safeActionError';

export const WORKOUT_NOT_FOUND_MESSAGE = 'Treino não encontrado.';
export const STUDENT_GONE_MESSAGE = 'Aluno não encontrado.';
export const WORKOUT_ACTIVE_INVALID_MESSAGE =
  'Um treino ativo precisa ter ao menos uma sessão e um exercício em cada sessão. Desative o treino para esvaziá-lo.';
export const WORKOUT_IS_ACTIVE_MESSAGE =
  'Desative o treino antes de excluí-lo.';
export const DUPLICATE_LIMIT_MESSAGE = 'Escolha no máximo 20 alunos por vez.';
export const DUPLICATE_TARGETS_MESSAGE =
  'Algum dos alunos escolhidos não foi encontrado. Nenhuma cópia foi criada.';
export const LIBRARY_EXERCISE_MESSAGE =
  'Algum exercício da biblioteca não está mais disponível. Remova-o e tente de novo.';
export const FOREIGN_ITEM_MESSAGE =
  'O treino mudou em outra aba. Recarregue a página para continuar.';

const VALIDATION: ErrorMapping = {
  status: 400,
  message: 'Verifique os dados do treino e tente de novo.',
};

export const WORKOUT_WRITE_ERRORS: ErrorMapping[] = [
  { status: 400, code: 'foreign_item_id', message: FOREIGN_ITEM_MESSAGE },
  {
    status: 400,
    code: 'invalid_library_exercise',
    message: LIBRARY_EXERCISE_MESSAGE,
  },
  { status: 400, code: 'duplicate_limit', message: DUPLICATE_LIMIT_MESSAGE },
  VALIDATION,
  {
    status: 404,
    code: 'duplicate_targets_invalid',
    message: DUPLICATE_TARGETS_MESSAGE,
  },
  {
    status: 404,
    code: 'workout_not_found',
    message: WORKOUT_NOT_FOUND_MESSAGE,
  },
  { status: 404, code: 'student_not_found', message: STUDENT_GONE_MESSAGE },
  {
    status: 409,
    code: 'workout_is_active',
    message: WORKOUT_IS_ACTIVE_MESSAGE,
  },
  TOO_MANY_REQUESTS,
];

export const LIBRARY_SEARCH_ERRORS: ErrorMapping[] = [
  {
    status: 400,
    message: 'Não foi possível buscar com esse texto.',
  },
  TOO_MANY_REQUESTS,
];
