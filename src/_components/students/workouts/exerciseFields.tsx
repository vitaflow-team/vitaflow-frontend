'use client';

import {
  EXERCISE_LOAD_MAX,
  EXERCISE_REPS_MAX,
  VIDEO_URL_MAX,
} from '@/_constants/educatorWorkoutLimits';
import type { EditableExerciseField, EditorAction } from '@/_lib/workoutEditor';
import type { EditorExercise } from '@/_types/workoutEditor';
import type { Dispatch } from 'react';
import { TextField } from './textField';

interface ExerciseFieldsProps {
  sessionKey: string;
  exercise: EditorExercise;
  errors: Record<string, string>;
  /** `sessions.<i>.exercises.<j>`, the prefix of this exercise's error paths. */
  path: string;
  dispatch: Dispatch<EditorAction>;
}

/** What the student will open: the educator's link, else the library video, else nothing. */
export function videoIndication(exercise: EditorExercise): string {
  if (exercise.videoUrl.trim() !== '') return 'O aluno verá o seu link.';

  return exercise.libraryVideoUrl
    ? 'Sem link seu, o aluno verá o vídeo da biblioteca.'
    : 'Sem vídeo: o aluno não verá o botão de vídeo.';
}

/** Series, repetitions, load and video link, each with its message beside it. */
export function ExerciseFields({
  sessionKey,
  exercise,
  errors,
  path,
  dispatch,
}: ExerciseFieldsProps) {
  const field = (
    name: EditableExerciseField,
    label: string,
    extra: { maxLength?: number; inputMode?: 'numeric' | 'url'; hint?: string }
  ) => (
    <TextField
      id={`${exercise.key}-${name}`}
      label={label}
      value={exercise[name]}
      error={errors[`${path}.${name}`]}
      required={name === 'sets' || name === 'reps'}
      onChange={value =>
        dispatch({
          type: 'update-exercise',
          sessionKey,
          exerciseKey: exercise.key,
          field: name,
          value,
        })
      }
      {...extra}
    />
  );

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {field('sets', 'Séries', { inputMode: 'numeric' })}
      {field('reps', 'Repetições', { maxLength: EXERCISE_REPS_MAX })}
      {field('load', 'Carga (opcional)', { maxLength: EXERCISE_LOAD_MAX })}
      <div className="sm:col-span-3">
        {field('videoUrl', 'Link do vídeo (opcional)', {
          maxLength: VIDEO_URL_MAX,
          inputMode: 'url',
          hint: videoIndication(exercise),
        })}
      </div>
    </div>
  );
}
