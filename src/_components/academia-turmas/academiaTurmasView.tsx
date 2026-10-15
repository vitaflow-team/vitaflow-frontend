import type { AcademiaEmployment } from '@/_types/academia';
import type { TurmaAgendaItem } from '@/_types/turmas';
import { AcademiaTurmasEmptyState } from './academiaTurmasEmptyState';
import { AcademiaTurmasGrid } from './academiaTurmasGrid';
import { CreateTurmaPanel } from './createTurmaPanel';

interface AcademiaTurmasViewProps {
  turmas: TurmaAgendaItem[];
  employments: AcademiaEmployment[];
}

export function AcademiaTurmasView({
  turmas,
  employments,
}: AcademiaTurmasViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Turmas</h1>
        {turmas.length > 0 && <CreateTurmaPanel employments={employments} />}
      </div>
      {turmas.length === 0 ? (
        <AcademiaTurmasEmptyState employments={employments} />
      ) : (
        <AcademiaTurmasGrid turmas={turmas} employments={employments} />
      )}
    </div>
  );
}
