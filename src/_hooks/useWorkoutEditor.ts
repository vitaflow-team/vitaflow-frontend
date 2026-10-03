'use client';

import { useWorkoutSave } from '@/_hooks/useWorkoutSave';
import {
  ACTIVE_RULE_MESSAGE,
  breaksActiveRule,
  initialEditorState,
  isEditorDirty,
  snapshotOf,
  treeToEditor,
  workoutEditorReducer,
  type EditorAction,
} from '@/_lib/workoutEditor';
import type { WorkoutTree } from '@/_types/educatorWorkouts';
import type { WorkoutEditorState } from '@/_types/workoutEditor';
import { useReducer, useState, type Dispatch } from 'react';

export interface WorkoutEditorModel {
  state: WorkoutEditorState;
  dispatch: Dispatch<EditorAction>;
  /** Messages next to fields, keyed by path (`sessions.0.name`). */
  errors: Record<string, string>;
  /** A failure of the whole save (shown above the buttons). */
  saveError: string | null;
  isDirty: boolean;
  isSaving: boolean;
  /** The student or the workout vanished while editing; the values stay. */
  isGone: boolean;
  status: WorkoutTree['status'];
  save: () => Promise<void>;
  /** The server's tree after a lifecycle change: becomes the new saved state. */
  adopt: (tree: WorkoutTree) => void;
}

/**
 * The working copy of one workout and its save. Saving sends the whole tree in
 * one request; a failure keeps every typed value, and an invalid active
 * workout is refused here before it is sent (the server refuses it too).
 */
export function useWorkoutEditor(
  studentId: string,
  tree: WorkoutTree
): WorkoutEditorModel {
  const [state, rawDispatch] = useReducer(
    workoutEditorReducer,
    tree,
    initialEditorState
  );
  const [saved, setSaved] = useState(() =>
    snapshotOf(initialEditorState(tree))
  );
  const [status, setStatus] = useState(tree.status);

  function adopt(next: WorkoutTree) {
    const editor = treeToEditor(next);
    rawDispatch({ type: 'replace', state: editor });
    setSaved(snapshotOf(editor));
    setStatus(next.status);
  }

  const { setSaveError, ...saveModel } = useWorkoutSave({
    studentId,
    workoutId: tree.id,
    status,
    state,
    onSaved: adopt,
  });

  // Edits go through here: the active workout must stay valid, so removing its
  // last exercise or last session is refused with the reason, not applied.
  function dispatch(action: EditorAction) {
    if (status === 'ACTIVE' && breaksActiveRule(state, action)) {
      return setSaveError(ACTIVE_RULE_MESSAGE);
    }
    setSaveError(null);
    rawDispatch(action);
  }

  return {
    ...saveModel,
    state,
    dispatch,
    isDirty: isEditorDirty(saved, state),
    status,
    adopt,
  };
}
