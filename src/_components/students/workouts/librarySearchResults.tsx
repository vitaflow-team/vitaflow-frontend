import { Button } from '@/_components/ui/button';
import { EQUIPMENT_LABELS } from '@/_constants/exerciseCatalog';
import type { LibrarySearchState } from '@/_hooks/useLibrarySearch';
import type { Exercise } from '@/_types/exercise';

interface LibrarySearchResultsProps {
  state: LibrarySearchState;
  query: string;
  disabled: boolean;
  onPick: (exercise: Exercise) => void;
  onUseName: () => void;
}

interface LibraryListProps {
  exercises: Exercise[];
  disabled: boolean;
  onPick: (exercise: Exercise) => void;
}

function LibraryList({ exercises, disabled, onPick }: LibraryListProps) {
  return (
    <ul aria-label="Exercícios da biblioteca" className="flex flex-col">
      {exercises.map(exercise => (
        <li
          key={exercise.id}
          className="flex items-center justify-between gap-2 border-b border-line py-2 last:border-b-0"
        >
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">
              {exercise.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {exercise.muscleGroup} · {EQUIPMENT_LABELS[exercise.equipment]}
            </span>
          </span>
          <Button
            type="button"
            size="sm"
            disabled={disabled}
            aria-label={`Adicionar ${exercise.name}`}
            onClick={() => onPick(exercise)}
          >
            Adicionar
          </Button>
        </li>
      ))}
    </ul>
  );
}

/** The library matches, or the state that explains why there are none. */
export function LibrarySearchResults({
  state,
  query,
  disabled,
  onPick,
  onUseName,
}: LibrarySearchResultsProps) {
  if (state.kind === 'idle') return null;
  if (state.kind === 'loading') {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Buscando…
      </p>
    );
  }
  if (state.kind === 'error') {
    return (
      <p role="alert" className="text-sm font-medium text-destructive">
        {state.message} Você ainda pode adicionar o exercício pelo nome.
      </p>
    );
  }
  if (state.exercises.length > 0) {
    return (
      <LibraryList
        exercises={state.exercises}
        disabled={disabled}
        onPick={onPick}
      />
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <p className="text-sm text-muted-foreground">
        Nenhum exercício encontrado para “{query.trim()}”.
      </p>
      <Button type="button" variant="outline" size="sm" onClick={onUseName}>
        Adicionar “{query.trim()}” pelo nome
      </Button>
    </div>
  );
}
