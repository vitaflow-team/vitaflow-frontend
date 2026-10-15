import type { ProfessorListItem } from '@/_types/professores';
import { EmploymentInvitationStatusBadge } from './employmentInvitationStatusBadge';
import { ProfessorRowActions } from './professorRowActions';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface ProfessoresListProps {
  items: ProfessorListItem[];
}

export function ProfessoresList({ items }: ProfessoresListProps) {
  return (
    <ul aria-label="Professores" className="flex flex-col gap-2">
      {items.map(item => (
        <li
          key={item.id}
          className="bg-card flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold break-words">
                {item.name ?? item.email}
              </span>
              <EmploymentInvitationStatusBadge status={item.status} />
            </div>
            <span className="text-muted-foreground text-sm">
              {item.email}
              {item.status === 'ACTIVE' && item.startedAt && (
                <> · Desde {formatDate(item.startedAt)}</>
              )}
              {' · '}
              {item.academiaStudentCount}{' '}
              {item.academiaStudentCount === 1 ? 'aluno' : 'alunos'}
            </span>
          </div>
          <ProfessorRowActions
            id={item.id}
            name={item.name}
            status={item.status}
          />
        </li>
      ))}
    </ul>
  );
}
