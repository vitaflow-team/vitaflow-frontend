'use client';

import type { EditorAction } from '@/_lib/workoutEditor';
import type { EditorSession } from '@/_types/workoutEditor';
import type { Dispatch } from 'react';
import { ExerciseRow } from './exerciseRow';

interface SessionExerciseListProps {
  session: EditorSession;
  label: string;
  path: string;
  errors: Record<string, string>;
  dispatch: Dispatch<EditorAction>;
}

/** The exercises of one session with their group message, or the empty state. */
export function SessionExerciseList({
  session,
  label,
  path,
  errors,
  dispatch,
}: SessionExerciseListProps) {
  const error = errors[`${path}.exercises`];

  return (
    <>
      {error && (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
      {session.exercises.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum exercício nesta sessão ainda.
        </p>
      ) : (
        <ul
          aria-label={`Exercícios da sessão ${label}`}
          className="flex flex-col gap-3"
        >
          {session.exercises.map((exercise, index) => (
            <ExerciseRow
              key={exercise.key}
              sessionKey={session.key}
              exercise={exercise}
              index={index}
              total={session.exercises.length}
              path={`${path}.exercises.${index}`}
              errors={errors}
              dispatch={dispatch}
            />
          ))}
        </ul>
      )}
    </>
  );
}
