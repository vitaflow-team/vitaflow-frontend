import type { Student } from '@/_types/students';
import { StudentActions } from './studentActions';
import { StudentBreadcrumb } from './studentBreadcrumb';
import { StudentIdentity } from './studentIdentity';

interface StudentHeaderProps {
  student: Student;
}

export function StudentHeader({ student }: StudentHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <StudentBreadcrumb name={student.name} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <StudentIdentity student={student} />
        <StudentActions student={student} />
      </div>
    </header>
  );
}
