import { describe, expect, it } from 'vitest';
import {
  atTargetLimit,
  canDuplicate,
  filterStudents,
  toggleTarget,
} from './duplicateSelection';
import {
  EDUCATOR_PLAN_HREF,
  parseArchivedPage,
  workoutEditorHref,
  workoutsHref,
} from './workoutLinks';

const ID = '01890a5d-ac96-774b-bcce-b302099a8057';

describe('workout addresses', () => {
  it('keeps page 1 of the archived list out of the address', () => {
    expect(workoutsHref(ID)).toBe(`/restrict/students/${ID}/workouts`);
    expect(workoutsHref(ID, 1)).toBe(`/restrict/students/${ID}/workouts`);
    expect(workoutsHref(ID, 3)).toBe(
      `/restrict/students/${ID}/workouts?arquivados=3`
    );
    expect(workoutEditorHref(ID, 'w1')).toBe(
      `/restrict/students/${ID}/workouts/w1`
    );
  });

  it('UT-086 reads the archived page, and anything unusable as page 1', () => {
    expect(parseArchivedPage('2')).toBe(2);
    expect(parseArchivedPage(['4', '5'])).toBe(4);
    for (const value of [undefined, '', '0', '-1', '1.5', 'abc', '<b>']) {
      expect(parseArchivedPage(value)).toBe(1);
    }
  });

  it('points the student side at the educator plan', () => {
    expect(EDUCATOR_PLAN_HREF).toBe('/restrict/workouts?plano=educador');
  });
});

describe('duplicate selection', () => {
  const ids = Array.from({ length: 25 }, (_, index) => `s${index}`);

  it('UT-116 needs at least one student and stops at twenty', () => {
    expect(canDuplicate([])).toBe(false);
    expect(canDuplicate(['a'])).toBe(true);

    let selected: string[] = [];
    for (const id of ids) selected = toggleTarget(selected, id);

    expect(selected).toHaveLength(20);
    expect(atTargetLimit(selected)).toBe(true);
    expect(canDuplicate(selected)).toBe(true);
  });

  it('unmarks a marked student, even at the limit', () => {
    let selected: string[] = [];
    for (const id of ids.slice(0, 20)) selected = toggleTarget(selected, id);

    selected = toggleTarget(selected, 's3');

    expect(selected).toHaveLength(19);
    expect(selected).not.toContain('s3');
    expect(atTargetLimit(selected)).toBe(false);
  });

  it('filters by name or e-mail ignoring case and accents', () => {
    const students = [
      { name: 'João Pêra', email: 'joao@example.com' },
      { name: 'Maria', email: 'maria@example.com' },
    ];

    expect(filterStudents(students, 'joao')).toEqual([students[0]]);
    expect(filterStudents(students, 'MARIA@')).toEqual([students[1]]);
    expect(filterStudents(students, '  ')).toEqual(students);
    expect(filterStudents(students, 'zzz')).toEqual([]);
  });
});
