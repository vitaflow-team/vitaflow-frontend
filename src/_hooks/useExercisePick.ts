'use client';

import { checkWorkoutConflicts } from '@/_actions/students/workouts/checkWorkoutConflicts';
import { useLibrarySearch } from '@/_hooks/useLibrarySearch';
import type { FreeExerciseValues } from '@/_lib/freeExercise';
import { newKey } from '@/_lib/newKey';
import { exerciseFromLibrary, exerciseFromName } from '@/_lib/workoutEditor';
import type { Exercise } from '@/_types/exercise';
import type { EditorExercise } from '@/_types/workoutEditor';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

/**
 * What the exercise picker types and picks. A library pick asks the backend
 * which of the student's restrictions it conflicts with; if that check fails
 * the exercise is added without a warning, and the workout can still be saved.
 */
export function useExercisePick(
  studentId: string,
  onAdd: (exercise: EditorExercise) => void
) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [freeName, setFreeName] = useState('');
  const search = useLibrarySearch(query);
  const conflicts = useServerAction(checkWorkoutConflicts);

  function finish(exercise: EditorExercise) {
    onAdd(exercise);
    setOpen(false);
    setQuery('');
    setFreeName('');
  }

  async function pickLibrary(library: Exercise) {
    const [result] = await conflicts.execute({
      studentId,
      exerciseIds: [library.id],
    });
    const found = result?.conflicts[library.id] ?? [];
    finish(exerciseFromLibrary(library, newKey(), found));
  }

  return {
    open,
    setOpen,
    query,
    setQuery,
    freeName,
    setFreeName,
    search,
    isPicking: conflicts.isPending,
    pickLibrary,
    pickFree: (values: FreeExerciseValues) =>
      finish(exerciseFromName(values, newKey())),
  };
}
