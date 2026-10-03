'use client';

import {
  UnsavedChangesProvider,
  useUnsavedChanges,
} from '@/_components/settings/unsavedChangesProvider';
import { useWorkoutEditor } from '@/_hooks/useWorkoutEditor';
import { useWorkoutLifecycle } from '@/_hooks/useWorkoutLifecycle';
import type { WorkoutTree } from '@/_types/educatorWorkouts';
import type { StudentListItem } from '@/_types/students';
import { useEffect } from 'react';
import { DuplicateWorkoutDialog } from './duplicateWorkoutDialog';
import { EditorFields } from './editorFields';
import { EditorFooter } from './editorFooter';
import { EditorHeader } from './editorHeader';
import { LifecycleActions } from './lifecycleActions';
import { SessionArea } from './sessionArea';

interface WorkoutEditorProps {
  studentId: string;
  tree: WorkoutTree;
  students: StudentListItem[];
}

const DISCARD_MESSAGE =
  'Se sair agora, as alterações feitas neste treino serão perdidas.';

function EditorBody({ studentId, tree, students }: WorkoutEditorProps) {
  const editor = useWorkoutEditor(studentId, tree);
  const lifecycle = useWorkoutLifecycle(studentId, tree.id, editor.adopt);
  const { setDirty } = useUnsavedChanges();
  const { isDirty } = editor;
  useEffect(() => setDirty(isDirty), [isDirty, setDirty]);

  return (
    <div className="flex flex-col gap-4">
      <EditorHeader
        studentId={studentId}
        status={editor.status}
        isGone={editor.isGone}
      />
      <EditorFields
        state={editor.state}
        errors={editor.errors}
        dispatch={editor.dispatch}
      />
      <SessionArea studentId={studentId} editor={editor} />
      <EditorFooter
        isSaving={editor.isSaving}
        isDirty={isDirty}
        saveError={editor.saveError}
        onSave={() => void editor.save()}
      />
      <hr className="border-line" />
      <LifecycleActions
        title={editor.state.title}
        status={editor.status}
        isDirty={isDirty}
        isPending={lifecycle.isPending}
        error={lifecycle.error}
        problems={lifecycle.problems}
        onActivate={() => void lifecycle.runActivate()}
        onDeactivate={() => void lifecycle.runDeactivate()}
        onDelete={() => void lifecycle.runRemove()}
      />
      <DuplicateWorkoutDialog
        studentId={studentId}
        workoutId={tree.id}
        students={students}
      />
    </div>
  );
}

/** The workout editor: the working copy, its save, its lifecycle and its copies. */
export function WorkoutEditor(props: WorkoutEditorProps) {
  return (
    <UnsavedChangesProvider message={DISCARD_MESSAGE}>
      <EditorBody {...props} />
    </UnsavedChangesProvider>
  );
}
