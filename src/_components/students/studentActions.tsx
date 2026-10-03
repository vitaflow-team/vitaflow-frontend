import { buttonVariants } from '@/_components/ui/button';
import type { Student } from '@/_types/students';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { EditStudentDialog } from './editStudentDialog';
import { RemoveStudentDialog } from './removeStudentDialog';

interface StudentActionsProps {
  student: Student;
}

/** "Mensagem" exists only for a student with an account to message. */
export function StudentActions({ student }: StudentActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {student.userId && (
        <Link
          href={`/restrict/messages/${student.userId}`}
          className={buttonVariants({ variant: 'outline' })}
        >
          <MessageCircle aria-hidden="true" />
          Mensagem
        </Link>
      )}
      <EditStudentDialog student={student} />
      <RemoveStudentDialog
        studentId={student.id}
        studentName={student.name}
        hasAssessments={student.overview.latest !== null}
      />
    </div>
  );
}
