/** The backend's limits for a fixed weekly time (mirrors the API; change both together). */
export const FIXED_TIME_LIMIT = 14;
export const FIXED_WEEKDAY_MIN = 1;
export const FIXED_WEEKDAY_MAX = 7;
export const FIXED_START_STEP = 5;
export const FIXED_START_MAX = 1435;
export const FIXED_DURATION_DEFAULT = 60;
export const FIXED_DURATION_MIN = 15;
export const FIXED_DURATION_MAX = 240;
export const FIXED_DAY_MINUTES = 1440;
export const FIXED_ONLINE_LINK_MAX = 500;
export const FIXED_WORKOUT_LETTERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
] as const;

/** Weekdays by ISO number, 1 Monday .. 7 Sunday. */
export const WEEKDAY_NAMES: Record<number, string> = {
  1: 'Segunda-feira',
  2: 'Terça-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado',
  7: 'Domingo',
};
