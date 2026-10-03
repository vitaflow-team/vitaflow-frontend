import { studentTabHref } from '@/_lib/studentsTabs';

/** The student's workouts list, with the archived page in the address after page 1. */
export function workoutsHref(studentId: string, archivedPage = 1): string {
  const base = studentTabHref(studentId, 'workouts');
  return archivedPage > 1 ? `${base}?arquivados=${archivedPage}` : base;
}

export function workoutEditorHref(
  studentId: string,
  workoutId: string
): string {
  return `${studentTabHref(studentId, 'workouts')}/${workoutId}`;
}

/** `?arquivados=` comes from the address bar: anything unusable is page 1. */
export function parseArchivedPage(
  value: string | string[] | undefined
): number {
  const first = Array.isArray(value) ? value[0] : value;
  const page = Number(first);

  return Number.isInteger(page) && page >= 1 ? page : 1;
}

/** The student-side address that shows the educator's workout. */
export const EDUCATOR_PLAN_HREF = '/restrict/workouts?plano=educador';
