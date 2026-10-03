'use client';

import type { WorkoutEditorModel } from '@/_hooks/useWorkoutEditor';
import { newKey } from '@/_lib/newKey';
import { canAddSession } from '@/_lib/workoutEditor';
import { useState } from 'react';
import { SessionPanel } from './sessionPanel';
import { SessionSwitch } from './sessionSwitch';

interface SessionAreaProps {
  studentId: string;
  editor: WorkoutEditorModel;
}

/** The session tabs and the panel of the one being edited. */
export function SessionArea({ studentId, editor }: SessionAreaProps) {
  const { sessions } = editor.state;
  const [activeKey, setActiveKey] = useState<string | null>(
    sessions[0]?.key ?? null
  );
  const position = Math.max(
    0,
    sessions.findIndex(session => session.key === activeKey)
  );
  const active = sessions[position];

  function addSession() {
    const key = newKey();
    editor.dispatch({ type: 'add-session', key });
    setActiveKey(key);
  }

  return (
    <>
      <SessionSwitch
        sessions={sessions}
        activeKey={active?.key ?? null}
        canAdd={canAddSession(editor.state)}
        onSelect={setActiveKey}
        onAdd={addSession}
      />
      {active ? (
        <SessionPanel
          key={active.key}
          studentId={studentId}
          session={active}
          position={position}
          total={sessions.length}
          errors={editor.errors}
          dispatch={editor.dispatch}
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          Este treino ainda não tem sessões. Adicione a primeira.
        </p>
      )}
    </>
  );
}
