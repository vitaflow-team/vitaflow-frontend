import { DUPLICATE_TARGETS_MAX } from '@/_constants/educatorWorkoutLimits';

/** Marks or unmarks a student; marking beyond the limit changes nothing. */
export function toggleTarget(selected: string[], studentId: string): string[] {
  if (selected.includes(studentId)) {
    return selected.filter(id => id !== studentId);
  }

  return selected.length >= DUPLICATE_TARGETS_MAX
    ? selected
    : [...selected, studentId];
}

export function canDuplicate(selected: string[]): boolean {
  return selected.length >= 1 && selected.length <= DUPLICATE_TARGETS_MAX;
}

export function atTargetLimit(selected: string[]): boolean {
  return selected.length >= DUPLICATE_TARGETS_MAX;
}

export const TARGET_LIMIT_TEXT = `Você pode copiar para no máximo ${DUPLICATE_TARGETS_MAX} alunos por vez.`;

/** Case- and accent-insensitive filter over name and e-mail, on the page. */
export function filterStudents<T extends { name: string; email: string }>(
  students: T[],
  query: string
): T[] {
  const fold = (value: string) =>
    value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();
  const needle = fold(query.trim());
  if (needle === '') return students;

  return students.filter(student =>
    fold(`${student.name} ${student.email}`).includes(needle)
  );
}
