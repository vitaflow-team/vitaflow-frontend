/** The backend's limits for an educator workout, mirrored here. */
export const WORKOUT_TITLE_MAX = 80;
export const WORKOUT_FREQUENCY_MIN = 1;
export const WORKOUT_FREQUENCY_MAX = 7;
export const WORKOUT_SESSIONS_MAX = 7;
export const SESSION_NAME_MAX = 60;
export const SESSION_EXERCISES_MAX = 30;
export const EXERCISE_SETS_MIN = 1;
export const EXERCISE_SETS_MAX = 20;
export const EXERCISE_REPS_MAX = 30;
export const EXERCISE_LOAD_MAX = 30;
export const FREE_EXERCISE_NAME_MAX = 80;
export const VIDEO_URL_MAX = 500;
export const DUPLICATE_TARGETS_MAX = 20;

export const WORKOUT_STATUS_LABELS = {
  DRAFT: 'Rascunho',
  ACTIVE: 'Ativo',
  ARCHIVED: 'Arquivado',
} as const;

export const SESSION_LABELS = 'ABCDEFG';
