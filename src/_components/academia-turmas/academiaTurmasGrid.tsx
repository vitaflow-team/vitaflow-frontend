import type { AcademiaEmployment } from '@/_types/academia';
import type { TurmaAgendaItem } from '@/_types/turmas';
import { WEEKDAY_LABELS, WEEKDAYS } from '@/_lib/turmaSchedule';
import { AcademiaTurmaCard } from './academiaTurmaCard';

interface AcademiaTurmasGridProps {
  turmas: TurmaAgendaItem[];
  employments: AcademiaEmployment[];
}

export function AcademiaTurmasGrid({
  turmas,
  employments,
}: AcademiaTurmasGridProps) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7"
      aria-label="Agenda semanal de turmas"
    >
      {WEEKDAYS.map(weekday => {
        const dayTurmas = turmas.filter(turma => turma.weekday === weekday);
        return (
          <div key={weekday} className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-muted-foreground">
              {WEEKDAY_LABELS[weekday]}
            </h2>
            {dayTurmas.length === 0 ? (
              <p
                className="text-xs text-muted-foreground"
                data-testid={`empty-day-${weekday}`}
              >
                Nenhuma turma
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {dayTurmas.map(turma => (
                  <AcademiaTurmaCard
                    key={turma.id}
                    turma={turma}
                    employments={employments}
                  />
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
