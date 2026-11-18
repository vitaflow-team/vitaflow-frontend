import type { AcademiaEmployment } from '@/_types/academia';
import type { AcademiaStudentListItem } from '@/_types/academiaAlunos';
import type { GymBillingAvailability } from '@/_types/gymBillingAvailability';
import { AcademiaAlunoRow } from './academiaAlunoRow';

interface AcademiaAlunosListProps {
  items: AcademiaStudentListItem[];
  employments: AcademiaEmployment[];
  billing: GymBillingAvailability;
}

export function AcademiaAlunosList({
  items,
  employments,
  billing,
}: AcademiaAlunosListProps) {
  return (
    <ul aria-label="Alunos" className="flex flex-col gap-2">
      {items.map(item => (
        <AcademiaAlunoRow
          key={item.id}
          item={item}
          employments={employments}
          billing={billing}
        />
      ))}
    </ul>
  );
}
