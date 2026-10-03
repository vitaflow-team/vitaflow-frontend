import { STUDENTS_PATH } from '@/_lib/studentsList';

/**
 * Only the tabs that have content: workouts, schedule, videos and billing are
 * not listed until they exist (ADR-001).
 */
export const STUDENT_TABS = ['overview', 'assessment', 'workouts'] as const;

export type StudentTab = (typeof STUDENT_TABS)[number];

export const STUDENT_TAB_LABELS: Record<StudentTab, string> = {
  overview: 'Visão geral',
  assessment: 'Avaliação física',
  workouts: 'Treinos',
};

export function studentTabHref(studentId: string, tab: StudentTab): string {
  const base = `${STUDENTS_PATH}/${studentId}`;
  return tab === 'overview' ? base : `${base}/${tab}`;
}

/** The tab a pathname belongs to; the record root and unknown paths are the overview. */
export function activeStudentTab(
  pathname: string,
  studentId: string
): StudentTab {
  const under = (tab: StudentTab) => {
    const path = studentTabHref(studentId, tab);
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  if (under('assessment')) return 'assessment';
  return under('workouts') ? 'workouts' : 'overview';
}

export function studentTabId(tab: StudentTab): string {
  return `student-tab-${tab}`;
}

export function studentPanelId(tab: StudentTab): string {
  return `student-panel-${tab}`;
}

/** The assessment tab with the new-assessment form already open. */
export function newAssessmentHref(studentId: string): string {
  return `${studentTabHref(studentId, 'assessment')}?nova=1`;
}
