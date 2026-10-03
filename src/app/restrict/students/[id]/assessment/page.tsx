import { AssessmentTab } from '@/_components/students/assessmentTab';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import {
  isLoadFailure,
  loadAssessments,
  loadDeclarationAccepted,
  loadStudent,
} from '@/_lib/studentsData';
import { parseStudentsParams } from '@/_lib/studentsList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.student,
};

interface StudentAssessmentPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string | string[]; nova?: string | string[] }>;
}

/** "Avaliação física": the history, the variation and the new-assessment form. */
export default async function StudentAssessmentPage({
  params,
  searchParams,
}: StudentAssessmentPageProps) {
  const { id } = await params;
  const { page, nova } = await searchParams;
  const student = await loadStudent(id);
  if (isLoadFailure(student)) return null;

  const [list, accepted] = await Promise.all([
    loadAssessments(student.id, parseStudentsParams({ page }).page),
    loadDeclarationAccepted(),
  ]);

  if (isLoadFailure(list)) {
    return (
      <p className="text-sm text-muted-foreground">
        Não foi possível carregar as avaliações. Tente novamente em alguns
        instantes.
      </p>
    );
  }

  return (
    <AssessmentTab
      studentId={student.id}
      list={list}
      latest={student.overview.latest}
      declarationAccepted={accepted === true}
      openNewForm={nova === '1'}
    />
  );
}
