import { buttonVariants } from '@/_components/ui/button';
import type { AcademiaEmployment } from '@/_types/academia';
import type { AcademiaStudentListItem } from '@/_types/academiaAlunos';
import type { GymBillingAvailability } from '@/_types/gymBillingAvailability';
import Link from 'next/link';
import { AcademiaAlunoAssignSelect } from './academiaAlunoAssignSelect';
import { StudentAccessPlanPanel } from './studentAccessPlanPanel';

function formatSession(startAt: string): string {
  return new Date(startAt).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface AcademiaAlunoRowProps {
  item: AcademiaStudentListItem;
  employments: AcademiaEmployment[];
  billing: GymBillingAvailability;
}

/** One gym student: schedule and educator, the way to the student screen and the plan dialog. */
export function AcademiaAlunoRow({
  item,
  employments,
  billing,
}: AcademiaAlunoRowProps) {
  return (
    <li className="bg-card flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
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
      <div className="flex flex-col items-end gap-2">
        <AcademiaAlunoAssignSelect student={item} employments={employments} />
        <div className="flex items-center gap-2">
          <Link
            href={`/restrict/academia-alunos/${item.id}`}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Avaliar
          </Link>
          <StudentAccessPlanPanel
            clientId={item.id}
            studentName={item.name}
            billing={billing}
          />
        </div>
      </div>
    </li>
  );
}
