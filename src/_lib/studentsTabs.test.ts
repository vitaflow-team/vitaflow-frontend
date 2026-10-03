import { describe, expect, it } from 'vitest';
import {
  activeStudentTab,
  newAssessmentHref,
  STUDENT_TAB_LABELS,
  STUDENT_TABS,
  studentTabHref,
} from './studentsTabs';

const ID = '01890a5d-ac96-774b-bcce-b302099a8057';

describe('student record tabs', () => {
  it('UT-122 has exactly the tabs Visão geral, Avaliação física, Treinos and Horários', () => {
    expect(STUDENT_TABS.map(tab => STUDENT_TAB_LABELS[tab])).toEqual([
      'Visão geral',
      'Avaliação física',
      'Treinos',
      'Horários',
    ]);
  });

  it('reads the schedule address as the schedule tab', () => {
    expect(studentTabHref(ID, 'schedule')).toBe(
      `/restrict/students/${ID}/schedule`
    );
    expect(activeStudentTab(`/restrict/students/${ID}/schedule`, ID)).toBe(
      'schedule'
    );
  });

  it('gives each tab its own address', () => {
    expect(studentTabHref(ID, 'overview')).toBe(`/restrict/students/${ID}`);
    expect(studentTabHref(ID, 'assessment')).toBe(
      `/restrict/students/${ID}/assessment`
    );
    expect(studentTabHref(ID, 'workouts')).toBe(
      `/restrict/students/${ID}/workouts`
    );
    expect(newAssessmentHref(ID)).toBe(
      `/restrict/students/${ID}/assessment?nova=1`
    );
  });

  it('UT-168 reads the assessment address as the assessment tab', () => {
    expect(activeStudentTab(`/restrict/students/${ID}/assessment`, ID)).toBe(
      'assessment'
    );
    expect(activeStudentTab(`/restrict/students/${ID}/assessment/x`, ID)).toBe(
      'assessment'
    );
  });

  it('reads the workouts address, and the editor under it, as the workouts tab', () => {
    expect(activeStudentTab(`/restrict/students/${ID}/workouts`, ID)).toBe(
      'workouts'
    );
    expect(activeStudentTab(`/restrict/students/${ID}/workouts/abc`, ID)).toBe(
      'workouts'
    );
  });

  it('reads the workouts address, and the editor under it, as the workouts tab', () => {
    expect(studentTabHref(ID, 'workouts')).toBe(
      `/restrict/students/${ID}/workouts`
    );
    expect(activeStudentTab(`/restrict/students/${ID}/workouts`, ID)).toBe(
      'workouts'
    );
    expect(activeStudentTab(`/restrict/students/${ID}/workouts/abc`, ID)).toBe(
      'workouts'
    );
  });

  it('reads the record root and anything else as the overview', () => {
    expect(activeStudentTab(`/restrict/students/${ID}`, ID)).toBe('overview');
    expect(activeStudentTab('/restrict/students/other/assessment', ID)).toBe(
      'overview'
    );
  });
});
