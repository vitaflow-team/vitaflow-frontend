import { EXERCISE_ROUTES } from '@/_constants/exerciseCatalog';
import type { ExerciseFormMode } from '@/_types/exerciseFormMode';

export const EXERCISE_SAVE_FALLBACK =
  'Não foi possível salvar o exercício. Tente novamente.';

const SUCCESS_MESSAGES: Record<ExerciseFormMode['kind'], string> = {
  submit:
    'Sugestão enviada. Ela aparece no catálogo assim que a equipe Vita Flow aprovar.',
  create: 'Exercício publicado no catálogo.',
  edit: 'Exercício atualizado.',
};

/** The confirmation shown after a successful save. */
export function exerciseSaveMessage(mode: ExerciseFormMode): string {
  return SUCCESS_MESSAGES[mode.kind];
}

/**
 * Where the form goes after saving: an educator stays to follow the
 * submission in the list below the form; the backoffice returns to its list.
 */
export function exerciseSaveDestination(mode: ExerciseFormMode): string | null {
  return mode.kind === 'submit' ? null : EXERCISE_ROUTES.BACKOFFICE;
}
