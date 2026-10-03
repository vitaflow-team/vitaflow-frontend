'use client';

import { EQUIPMENT_LABELS } from '@/_constants/exerciseCatalog';
import type { EditorAction } from '@/_lib/workoutEditor';
import type { EditorExercise } from '@/_types/workoutEditor';
import type { Dispatch } from 'react';
import { ConflictMarker } from './conflictMarker';
import { ExerciseControls } from './exerciseControls';
import { ExerciseFields } from './exerciseFields';

interface ExerciseRowProps {
  sessionKey: string;
  exercise: EditorExercise;
  index: number;
  total: number;
  path: string;
  errors: Record<string, string>;
  dispatch: Dispatch<EditorAction>;
}

/** One exercise of a session: its identity, the marker, the fields and the order controls. */
export function ExerciseRow({
  sessionKey,
  exercise,
  index,
  total,
  path,
  errors,
  dispatch,
}: ExerciseRowProps) {
  return (
    <li className="flex flex-col gap-3 rounded-md border border-line p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium">{exercise.name}</p>
          <p className="text-xs text-muted-foreground">
            {exercise.muscleGroup}
            {exercise.equipment
              ? ` · ${EQUIPMENT_LABELS[exercise.equipment]}`
              : ''}
          </p>
        </div>
        <ExerciseControls
          sessionKey={sessionKey}
          exerciseKey={exercise.key}
          name={exercise.name}
          index={index}
          total={total}
          dispatch={dispatch}
        />
      </div>
      <ConflictMarker conflicts={exercise.conflicts} />
      <ExerciseFields
        sessionKey={sessionKey}
        exercise={exercise}
        errors={errors}
        path={path}
        dispatch={dispatch}
      />
    </li>
  );
}
