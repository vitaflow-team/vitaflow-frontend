import { WorkoutEditor } from '@/_components/students/workouts/workoutEditor';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import {
  isLoadFailure,
  loadStudentsForPicker,
  loadWorkoutTree,
} from '@/_lib/educatorWorkoutsData';
import { loadStudent } from '@/_lib/studentsData';
import { workoutsHref } from '@/_lib/workoutLinks';
import { buttonVariants } from '@/_components/ui/button';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: PAGE_TITLES.student,
};

interface WorkoutEditorPageProps {
  params: Promise<{ id: string; workoutId: string }>;
}

/** The editor of one workout; an unknown or foreign workout reads as not found. */
export default async function WorkoutEditorPage({
  params,
}: WorkoutEditorPageProps) {
  const { id, workoutId } = await params;
  const student = await loadStudent(id);
  if (isLoadFailure(student)) return null;

  const [tree, students] = await Promise.all([
    loadWorkoutTree(student.id, workoutId),
    loadStudentsForPicker(),
  ]);

  if (isLoadFailure(tree)) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-muted-foreground">
          {tree === 'failed'
            ? 'Não foi possível carregar o treino. Tente novamente em alguns instantes.'
            : 'Treino não encontrado.'}
        </p>
        <Link
          href={workoutsHref(student.id)}
          className={buttonVariants({ variant: 'outline' })}
        >
          Voltar para Treinos
        </Link>
      </div>
    );
  }

  return (
    <WorkoutEditor
      studentId={student.id}
      tree={tree}
      students={isLoadFailure(students) ? [] : students}
    />
  );
}
