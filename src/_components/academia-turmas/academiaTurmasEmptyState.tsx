import type { AcademiaEmployment } from '@/_types/academia';
import { CreateTurmaPanel } from './createTurmaPanel';

interface AcademiaTurmasEmptyStateProps {
  employments: AcademiaEmployment[];
}

export function AcademiaTurmasEmptyState({
  employments,
}: AcademiaTurmasEmptyStateProps) {
  return (
    <section
      aria-labelledby="academia-turmas-empty-title"
      className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line px-4 py-10 text-center"
    >
      <h2 id="academia-turmas-empty-title" className="text-lg font-semibold">
        Você ainda não tem turmas
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Crie a primeira turma semanal da academia: horário, duração, capacidade
        e, se quiser, um educador responsável.
      </p>
      <CreateTurmaPanel employments={employments} />
    </section>
  );
}
