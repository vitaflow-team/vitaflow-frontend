'use client';

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/_components/ui/dialog';
import { Input } from '@/_components/ui/input';
import type { LibrarySearchState } from '@/_hooks/useLibrarySearch';
import type { Exercise } from '@/_types/exercise';
import { FreeExerciseForm, type FreeExerciseValues } from './freeExerciseForm';
import { LibrarySearchResults } from './librarySearchResults';

interface ExercisePickerContentProps {
  query: string;
  freeName: string;
  search: LibrarySearchState;
  isPicking: boolean;
  onQueryChange: (value: string) => void;
  onFreeNameChange: (value: string) => void;
  onPickLibrary: (exercise: Exercise) => void;
  onPickFree: (values: FreeExerciseValues) => void;
}

/** The library search and the free-name form inside the picker dialog. */
export function ExercisePickerContent({
  query,
  freeName,
  search,
  isPicking,
  onQueryChange,
  onFreeNameChange,
  onPickLibrary,
  onPickFree,
}: ExercisePickerContentProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Adicionar exercício</DialogTitle>
        <DialogDescription>
          Busque na biblioteca ou adicione pelo nome.
        </DialogDescription>
      </DialogHeader>
      <label htmlFor="library-search" className="text-sm font-medium">
        Buscar na biblioteca
      </label>
      <Input
        id="library-search"
        type="search"
        value={query}
        autoComplete="off"
        onChange={event => onQueryChange(event.target.value)}
      />
      <LibrarySearchResults
        state={search}
        query={query}
        disabled={isPicking}
        onPick={onPickLibrary}
        onUseName={() => onFreeNameChange(query.trim())}
      />
      <h3 className="pt-2 text-sm font-semibold">Ou adicione pelo nome</h3>
      <FreeExerciseForm
        name={freeName}
        onNameChange={onFreeNameChange}
        onSubmit={onPickFree}
      />
    </>
  );
}
