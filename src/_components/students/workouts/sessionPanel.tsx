'use client';

import { sessionLabel, type EditorAction } from '@/_lib/workoutEditor';
import type { EditorSession } from '@/_types/workoutEditor';
import type { Dispatch } from 'react';
import { ExerciseAdder } from './exerciseAdder';
import { SessionExerciseList } from './sessionExerciseList';
import { SessionNameField } from './sessionNameField';
import { SessionToolbar } from './sessionToolbar';

interface SessionPanelProps {
  studentId: string;
  session: EditorSession;
  position: number;
  total: number;
  errors: Record<string, string>;
  dispatch: Dispatch<EditorAction>;
}

/** One session: its name, its order, its exercises and the picker that adds more. */
export function SessionPanel({
  studentId,
  session,
  position,
  total,
  errors,
  dispatch,
}: SessionPanelProps) {
  const path = `sessions.${position}`;
  const label = sessionLabel(position);

  return (
    <div
      role="tabpanel"
      id={`session-panel-${session.key}`}
      aria-labelledby={`session-tab-${session.key}`}
      className="flex flex-col gap-3"
    >
      <SessionNameField
        sessionKey={session.key}
        label={label}
        value={session.name}
        error={errors[`${path}.name`]}
        dispatch={dispatch}
      />
      <SessionToolbar
        sessionKey={session.key}
        label={label}
        name={session.name}
        exerciseCount={session.exercises.length}
        position={position}
        total={total}
        dispatch={dispatch}
      />
      <SessionExerciseList
        session={session}
        label={label}
        path={path}
        errors={errors}
        dispatch={dispatch}
      />
      <ExerciseAdder
        studentId={studentId}
        session={session}
        dispatch={dispatch}
      />
    </div>
  );
}
