import {
  academiaAlunosHref,
  type HorarioFilter,
} from '@/_lib/academiaAlunosList';
import { cn } from '@/_lib/utils';
import Link from 'next/link';

const OPTIONS: { label: string; value: HorarioFilter }[] = [
  { label: 'Todos', value: undefined },
  { label: 'Com horário', value: 'COM' },
  { label: 'Sem horário', value: 'SEM' },
];

interface AcademiaAlunosHorarioFilterProps {
  search?: string;
  horario: HorarioFilter;
}

export function AcademiaAlunosHorarioFilter({
  search,
  horario,
}: AcademiaAlunosHorarioFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar alunos por horário"
      className="flex w-full gap-1 overflow-x-auto border-b border-line"
    >
      {OPTIONS.map(option => {
        const isSelected = option.value === horario;

        return (
          <Link
            key={option.label}
            href={academiaAlunosHref({
              search,
              horario: option.value,
              page: 1,
            })}
            role="tab"
            aria-selected={isSelected}
            className={cn(
              'inline-flex min-h-11 shrink-0 items-center whitespace-nowrap border-b-2 border-transparent px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
              isSelected && 'border-primary font-semibold text-foreground'
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
