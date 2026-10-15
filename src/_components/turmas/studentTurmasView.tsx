import type { StudentTurmaItem } from '@/_types/studentTurmas';
import { StudentTurmasEmptyState } from './studentTurmasEmptyState';
import { StudentTurmasList } from './studentTurmasList';

interface StudentTurmasViewProps {
  items: StudentTurmaItem[];
}

export function StudentTurmasView({ items }: StudentTurmasViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Minhas turmas</h1>
      {items.length === 0 ? (
        <StudentTurmasEmptyState />
      ) : (
        <StudentTurmasList items={items} />
      )}
    </div>
  );
}
