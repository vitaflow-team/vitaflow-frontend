'use client';

import { searchLibraryExercises } from '@/_actions/students/workouts/searchLibraryExercises';
import { useDebouncedValue } from '@/_hooks/useDebouncedValue';
import type { Exercise } from '@/_types/exercise';
import { useEffect, useState } from 'react';
import { useServerAction } from 'zsa-react';

/** Pause after the last keystroke before the library is asked. */
export const LIBRARY_SEARCH_DEBOUNCE_MS = 350;

export type LibrarySearchState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'results'; exercises: Exercise[] }
  | { kind: 'error'; message: string };

/**
 * Searches the approved library as the educator types. A failure is shown as
 * a message and nothing else: adding by name keeps working.
 */
export function useLibrarySearch(query: string): LibrarySearchState {
  const settled = useDebouncedValue(query.trim(), LIBRARY_SEARCH_DEBOUNCE_MS);
  const action = useServerAction(searchLibraryExercises);
  const [state, setState] = useState<LibrarySearchState>({ kind: 'idle' });
  const { execute } = action;

  useEffect(() => {
    if (settled === '') {
      setState({ kind: 'idle' });
      return;
    }

    let current = true;
    setState({ kind: 'loading' });
    void execute({ q: settled }).then(([exercises, error]) => {
      if (!current) return;
      setState(
        error
          ? { kind: 'error', message: error.message }
          : { kind: 'results', exercises: exercises ?? [] }
      );
    });

    return () => {
      current = false;
    };
  }, [settled, execute]);

  return query.trim() === '' ? { kind: 'idle' } : state;
}
