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
  it('UT-126 has exactly the tabs Visão geral and Avaliação física', () => {
    expect(STUDENT_TABS.map(tab => STUDENT_TAB_LABELS[tab])).toEqual([
      'Visão geral',
      'Avaliação física',
    ]);
  });

  it('gives each tab its own address', () => {
    expect(studentTabHref(ID, 'overview')).toBe(`/restrict/students/${ID}`);
    expect(studentTabHref(ID, 'assessment')).toBe(
      `/restrict/students/${ID}/assessment`
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

  it('reads the record root and anything else as the overview', () => {
    expect(activeStudentTab(`/restrict/students/${ID}`, ID)).toBe('overview');
    expect(activeStudentTab('/restrict/students/other/assessment', ID)).toBe(
      'overview'
    );
  });
});
