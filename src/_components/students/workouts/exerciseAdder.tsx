'use client';

import { SESSION_EXERCISES_MAX } from '@/_constants/educatorWorkoutLimits';
import { canAddExercise, type EditorAction } from '@/_lib/workoutEditor';
import type { EditorExercise, EditorSession } from '@/_types/workoutEditor';
import { useState, type Dispatch } from 'react';
import { ConflictWarning } from './conflictWarning';
import { ExercisePicker } from './exercisePicker';

interface ExerciseAdderProps {
  studentId: string;
  session: EditorSession;
  dispatch: Dispatch<EditorAction>;
}

interface Warning {
  name: string;
  conflicts: EditorExercise['conflicts'];
}

/** The picker plus the warning shown when the added exercise conflicts with the student. */
export function ExerciseAdder({
  studentId,
  session,
  dispatch,
}: ExerciseAdderProps) {
  const [warning, setWarning] = useState<Warning | null>(null);

  function add(exercise: EditorExercise) {
    dispatch({ type: 'add-exercise', sessionKey: session.key, exercise });
    setWarning(
      exercise.conflicts.length > 0
        ? { name: exercise.name, conflicts: exercise.conflicts }
        : null
    );
  }

  return (
    <>
      {warning && (
        <ConflictWarning
          exerciseName={warning.name}
          conflicts={warning.conflicts}
          onDismiss={() => setWarning(null)}
        />
      )}
      <ExercisePicker
        studentId={studentId}
        disabled={!canAddExercise(session)}
        disabledReason={`Uma sessão pode ter no máximo ${SESSION_EXERCISES_MAX} exercícios.`}
        onAdd={add}
      />
    </>
  );
}
