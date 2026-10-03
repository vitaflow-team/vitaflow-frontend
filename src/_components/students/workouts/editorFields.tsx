'use client';

import {
  WORKOUT_FREQUENCY_MAX,
  WORKOUT_FREQUENCY_MIN,
  WORKOUT_TITLE_MAX,
} from '@/_constants/educatorWorkoutLimits';
import type { EditorAction } from '@/_lib/workoutEditor';
import type { WorkoutEditorState } from '@/_types/workoutEditor';
import type { Dispatch } from 'react';
import { TextField } from './textField';

interface EditorFieldsProps {
  state: WorkoutEditorState;
  errors: Record<string, string>;
  dispatch: Dispatch<EditorAction>;
}

/** The title (required) and the optional weekly frequency of the workout. */
export function EditorFields({ state, errors, dispatch }: EditorFieldsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
      <TextField
        id="workout-title"
        label="Título do treino"
        value={state.title}
        error={errors.title}
        maxLength={WORKOUT_TITLE_MAX}
        required
        onChange={value => dispatch({ type: 'set-title', value })}
      />
      <TextField
        id="workout-frequency"
        label="Dias por semana (opcional)"
        value={state.weeklyFrequency}
        error={errors.weeklyFrequency}
        inputMode="numeric"
        hint={`De ${WORKOUT_FREQUENCY_MIN} a ${WORKOUT_FREQUENCY_MAX}`}
        onChange={value => dispatch({ type: 'set-frequency', value })}
      />
    </div>
  );
}
