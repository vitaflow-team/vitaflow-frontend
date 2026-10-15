import type { AcademiaEmployment } from '@/_types/academia';
import type { AcademiaStudentListItem } from '@/_types/academiaAlunos';
import { AcademiaAlunoAssignSelect } from './academiaAlunoAssignSelect';

function formatSession(startAt: string): string {
  return new Date(startAt).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface AcademiaAlunosListProps {
  items: AcademiaStudentListItem[];
  employments: AcademiaEmployment[];
}

export function AcademiaAlunosList({
  items,
  employments,
}: AcademiaAlunosListProps) {
  return (
    <ul aria-label="Alunos" className="flex flex-col gap-2">
      {items.map(item => (
        <li
          key={item.id}
          className="bg-card flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-semibold break-words">{item.name}</span>
            <span className="text-muted-foreground text-sm">
              {item.email}
              {' · '}
              {item.nextSession
                ? `Com horário · ${formatSession(item.nextSession.startAt)}`
                : 'Sem horário'}
            </span>
            <span
              className="text-muted-foreground text-sm"
              data-testid="assigned-educator"
            >
              {item.assignedEducator
                ? `Educador: ${item.assignedEducator.name}`
                : 'Sem educador'}
            </span>
          </div>
          <AcademiaAlunoAssignSelect student={item} employments={employments} />
        </li>
      ))}
    </ul>
  );
}
