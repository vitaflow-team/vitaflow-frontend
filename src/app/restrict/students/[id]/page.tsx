import { StudentOverviewCard } from '@/_components/students/studentOverviewCard';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { isLoadFailure, loadStudent } from '@/_lib/studentsData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.student,
};

interface StudentOverviewPageProps {
  params: Promise<{ id: string }>;
}

/** "Visão geral": the layout already shows the not-found state when needed. */
export default async function StudentOverviewPage({
  params,
}: StudentOverviewPageProps) {
  const { id } = await params;
  const student = await loadStudent(id);
  if (isLoadFailure(student)) return null;

  return (
    <StudentOverviewCard studentId={student.id} overview={student.overview} />
  );
}
