import type { AcademiaEmployment } from '@/_types/academia';
import type { TurmaAgendaItem } from '@/_types/turmas';
import { minutesToTime } from '@/_lib/turmaSchedule';
import { EditTurmaPanel } from './editTurmaPanel';
import { ManualEnrollPanel } from './manualEnrollPanel';
import { RemoveTurmaButton } from './removeTurmaButton';
import { TurmaEducatorSelect } from './turmaEducatorSelect';

interface AcademiaTurmaCardProps {
  turma: TurmaAgendaItem;
  employments: AcademiaEmployment[];
}

export function AcademiaTurmaCard({
  turma,
  employments,
}: AcademiaTurmaCardProps) {
  return (
    <li className="bg-card flex flex-col gap-2 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold break-words">{turma.name}</span>
        <span className="text-muted-foreground text-sm">
          {minutesToTime(turma.startMinute)} · {turma.durationMinutes}min
        </span>
      </div>
      <span className="text-muted-foreground text-sm">
        {turma.enrolledCount}/{turma.capacity} inscritos
      </span>
      <span
        className="text-muted-foreground text-sm"
        data-testid="responsible-educator"
      >
        {turma.responsibleEducator
          ? `Responsável: ${turma.responsibleEducator.name}`
          : 'Sem responsável'}
      </span>
      <TurmaEducatorSelect turma={turma} employments={employments} />
      <div className="flex flex-wrap gap-2">
        <EditTurmaPanel turma={turma} />
        <ManualEnrollPanel turmaId={turma.id} />
        <RemoveTurmaButton
          turmaId={turma.id}
          name={turma.name}
          enrolledCount={turma.enrolledCount}
        />
      </div>
    </li>
  );
}
