import type { StudentListItem } from '@/_types/students';
import { StudentRow } from './studentRow';

interface StudentsListProps {
  students: StudentListItem[];
}

export function StudentsList({ students }: StudentsListProps) {
  return (
    <ul aria-label="Alunos" className="flex flex-col">
      {students.map(student => (
        <StudentRow key={student.id} student={student} />
      ))}
    </ul>
  );
}
