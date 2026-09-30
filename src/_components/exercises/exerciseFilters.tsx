'use client';

import { Button } from '@/_components/ui/button';
import { EQUIPMENT_LABELS, MUSCLE_GROUPS } from '@/_constants/exerciseCatalog';
import { useExerciseFilterNavigation } from '@/_hooks/useExerciseFilterNavigation';
import { hasActiveFilter } from '@/_lib/exerciseFilter';
import type { ExerciseEquipment } from '@/_types/exerciseEquipment';
import type { ExerciseFilter } from '@/_types/exerciseFilter';
import { ExerciseSearchField } from './exerciseSearchField';
import { FilterSelect } from './filterSelect';

const GROUP_OPTIONS = MUSCLE_GROUPS.map(group => ({
  value: group,
  label: group,
}));

const EQUIPMENT_OPTIONS = Object.entries(EQUIPMENT_LABELS).map(
  ([value, label]) => ({ value, label })
);

interface ExerciseFiltersProps {
  filter: ExerciseFilter;
  /** The page the filters belong to: the library or the backoffice list. */
  basePath: string;
}

/** Search, muscle group and equipment; every active filter applies at once. */
export function ExerciseFilters({ filter, basePath }: ExerciseFiltersProps) {
  const { apply, isPending } = useExerciseFilterNavigation(filter, basePath);

  return (
    <section
      aria-label="Filtros de exercícios"
      data-pending={isPending ? '' : undefined}
      className="grid gap-3 data-[pending]:opacity-70 md:grid-cols-[2fr_1fr_1fr_auto] md:items-end"
    >
      <ExerciseSearchField
        value={filter.q ?? ''}
        onSearch={term => apply({ q: term.trim() || undefined })}
      />
      <FilterSelect
        id="exercise-muscle-group"
        label="Grupo muscular"
        allLabel="Todos os grupos"
        value={filter.muscleGroup ?? ''}
        options={GROUP_OPTIONS}
        onChange={value => apply({ muscleGroup: value || undefined })}
      />
      <FilterSelect
        id="exercise-equipment"
        label="Equipamento"
        allLabel="Todos os equipamentos"
        value={filter.equipment ?? ''}
        options={EQUIPMENT_OPTIONS}
        onChange={value =>
          apply({ equipment: (value || undefined) as ExerciseEquipment })
        }
      />
      <Button
        type="button"
        variant="outline"
        disabled={!hasActiveFilter(filter)}
        onClick={() =>
          apply({ q: undefined, muscleGroup: undefined, equipment: undefined })
        }
      >
        Limpar filtros
      </Button>
    </section>
  );
}
