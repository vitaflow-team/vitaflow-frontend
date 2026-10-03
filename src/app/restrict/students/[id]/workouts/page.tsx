import { WorkoutsTab } from '@/_components/students/workouts/workoutsTab';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { isLoadFailure, loadWorkoutList } from '@/_lib/educatorWorkoutsData';
import { loadStudent } from '@/_lib/studentsData';
import { parseArchivedPage } from '@/_lib/workoutLinks';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.student,
};

interface StudentWorkoutsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ arquivados?: string | string[] }>;
}

/** "Treinos": the layout already shows the not-found state when the student is gone. */
export default async function StudentWorkoutsPage({
  params,
  searchParams,
}: StudentWorkoutsPageProps) {
  const { id } = await params;
  const { arquivados } = await searchParams;
  const student = await loadStudent(id);
  if (isLoadFailure(student)) return null;

  const list = await loadWorkoutList(student.id, parseArchivedPage(arquivados));
  if (isLoadFailure(list)) {
    return (
      <p className="text-sm text-muted-foreground">
        Não foi possível carregar os treinos. Tente novamente em alguns
        instantes.
      </p>
    );
  }

  return <WorkoutsTab studentId={student.id} list={list} />;
}
