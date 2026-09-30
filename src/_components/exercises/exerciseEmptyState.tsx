import { Dumbbell } from 'lucide-react';

interface ExerciseEmptyStateProps {
  /** Whether a search or filter is narrowing the list. */
  filtered: boolean;
}

/**
 * An explicit message instead of a blank list: a filter with no match
 * (US-002.EC-1, US-003.EC-1, US-011.EC-1) or a catalog still being built
 * (US-001.EC-1).
 */
export function ExerciseEmptyState({ filtered }: ExerciseEmptyStateProps) {
  return (
    <section className="bg-card flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
      <div className="bg-secondary text-icon-accent rounded-full p-4">
        <Dumbbell className="size-8" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold">
        {filtered
          ? 'Nenhum exercício encontrado para este filtro'
          : 'O catálogo de exercícios está sendo montado'}
      </h2>
      <p className="text-muted-foreground max-w-md">
        {filtered
          ? 'Tente outro nome, grupo muscular ou equipamento, ou limpe os filtros.'
          : 'Em breve os exercícios aparecem aqui.'}
      </p>
    </section>
  );
}
