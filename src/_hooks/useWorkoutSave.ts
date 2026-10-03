'use client';

import { saveWorkout } from '@/_actions/students/workouts/saveWorkout';
import {
  ACTIVE_RULE_MESSAGE,
  activeRuleViolation,
  validateEditor,
} from '@/_lib/workoutEditor';
import type { WorkoutStatus, WorkoutTree } from '@/_types/educatorWorkouts';
import type { WorkoutEditorState } from '@/_types/workoutEditor';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

interface WorkoutSaveInput {
  studentId: string;
  workoutId: string;
  status: WorkoutStatus;
  state: WorkoutEditorState;
  onSaved: (tree: WorkoutTree) => void;
}

/**
 * Saving the whole working copy in one request: field errors from the schema,
 * the active-workout rule checked before sending, and the reason when the
 * request fails. A failure never touches the typed values.
 */
export function useWorkoutSave({
  studentId,
  workoutId,
  status,
  state,
  onSaved,
}: WorkoutSaveInput) {
  const action = useServerAction(saveWorkout);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isGone, setIsGone] = useState(false);

  async function save() {
    if (action.isPending) return;
    setSaveError(null);

    const validation = validateEditor(state);
    setErrors(validation.ok ? {} : validation.errors);
    if (!validation.ok) return;

    const rule = status === 'ACTIVE' ? activeRuleViolation(state) : null;
    if (rule) return setSaveError(rule);

    const [result, failure] = await action.execute({
      studentId,
      workoutId,
      ...validation.payload,
    });
    if (failure) return setSaveError(failure.message);

    if (result.outcome === 'saved') onSaved(result.workout);
    else if (result.outcome === 'not_found') setIsGone(true);
    else setSaveError(ACTIVE_RULE_MESSAGE);
  }

  return {
    errors,
    saveError,
    setSaveError,
    isGone,
    isSaving: action.isPending,
    save,
  };
}
