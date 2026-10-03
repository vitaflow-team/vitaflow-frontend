import { formatIsoDay } from '@/_lib/studentsDates';
import { formatSessionWhen } from '@/_lib/scheduleFormat';
import { STUDENTS_PATH } from '@/_lib/studentsList';
import type { StudentListItem } from '@/_types/students';
import Link from 'next/link';
import { AccountChip } from './accountChip';

interface StudentRowProps {
  student: StudentListItem;
}

/** Names and e-mails are typed by users: React renders them as plain text. */
export function StudentRow({ student }: StudentRowProps) {
  return (
    <li className="border-b border-line last:border-b-0">
      <Link
        href={`${STUDENTS_PATH}/${student.id}`}
        className="flex min-h-14 flex-col gap-2 px-2 py-3 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0">
          <p className="truncate font-medium">{student.name}</p>
          <p className="truncate text-sm text-muted-foreground">
            {student.email}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <AccountChip hasAccount={student.hasAccount} />
          <span>
            {student.nextSession
              ? `Próximo: ${formatSessionWhen(student.nextSession.startAt)}`
              : 'Sem horário definido'}
          </span>
          <span>
            {student.lastAssessedOn
              ? `Última avaliação: ${formatIsoDay(student.lastAssessedOn)}`
              : 'Sem avaliação'}
          </span>
        </div>
      </Link>
    </li>
  );
}
