import { ScheduleTab } from '@/_components/students/schedule/scheduleTab';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { loadSchedule } from '@/_lib/educatorScheduleData';
import { isLoadFailure, loadStudent } from '@/_lib/studentsData';
import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants } from '@/_components/ui/button';
import { STUDENTS_PATH } from '@/_lib/studentsList';

export const metadata: Metadata = {
  title: PAGE_TITLES.student,
};

interface StudentSchedulePageProps {
  params: Promise<{ id: string }>;
}

/** "Horários": the fixed weekly times and the coming sessions of one student. */
export default async function StudentSchedulePage({
  params,
}: StudentSchedulePageProps) {
  const { id } = await params;
  const student = await loadStudent(id);
  if (isLoadFailure(student)) return null;

  const schedule = await loadSchedule(student.id);
  if (isLoadFailure(schedule)) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-muted-foreground">
          {schedule === 'failed'
            ? 'Não foi possível carregar os horários. Tente novamente em alguns instantes.'
            : 'Aluno não encontrado.'}
        </p>
        <Link
          href={STUDENTS_PATH}
          className={buttonVariants({ variant: 'outline' })}
        >
          Voltar para Alunos
        </Link>
      </div>
    );
  }

  return (
    <ScheduleTab
      studentId={student.id}
      schedule={schedule}
      sessionNames={student.overview.currentWorkout?.sessionNames ?? []}
    />
  );
}
