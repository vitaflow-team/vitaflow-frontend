import { ageInYears, formatMemberSince } from '@/_lib/studentsDates';
import type { Student } from '@/_types/students';
import { AccountChip } from './accountChip';

interface StudentIdentityProps {
  student: Student;
}

function subtitle(student: Student): string {
  const age = ageInYears(student.birthDate);
  const since = `Aluno desde ${formatMemberSince(student.createdAt)}`;

  return age === null ? since : `${age} anos · ${since}`;
}

/** Name, age (only when a birth date exists), member since, e-mail and chip. */
export function StudentIdentity({ student }: StudentIdentityProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <h1 className="truncate text-2xl font-semibold">{student.name}</h1>
      <p className="text-sm text-muted-foreground">{subtitle(student)}</p>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="min-w-0 truncate">{student.email}</span>
        <AccountChip hasAccount={student.hasAccount} />
      </div>
    </div>
  );
}
