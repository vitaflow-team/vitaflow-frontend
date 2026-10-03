'use client';

import { Button } from '@/_components/ui/button';
import { WORKOUT_SESSIONS_MAX } from '@/_constants/educatorWorkoutLimits';
import type { EditorSession } from '@/_types/workoutEditor';
import { Plus } from 'lucide-react';
import { SessionTabs } from './sessionTabs';

interface SessionSwitchProps {
  sessions: EditorSession[];
  activeKey: string | null;
  canAdd: boolean;
  onSelect: (key: string) => void;
  onAdd: () => void;
}

/** The sessions as tabs labeled A, B, C… by position, plus "Adicionar sessão". */
export function SessionSwitch({
  sessions,
  activeKey,
  canAdd,
  onSelect,
  onAdd,
}: SessionSwitchProps) {
  return (
    <div className="flex flex-col gap-2">
      <SessionTabs
        sessions={sessions}
        activeKey={activeKey}
        onSelect={onSelect}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canAdd}
          aria-describedby={canAdd ? undefined : 'sessions-limit'}
          onClick={onAdd}
        >
          <Plus aria-hidden="true" />
          Adicionar sessão
        </Button>
        {!canAdd && (
          <p id="sessions-limit" className="text-xs text-muted-foreground">
            Um treino pode ter no máximo {WORKOUT_SESSIONS_MAX} sessões (A a G).
          </p>
        )}
      </div>
    </div>
  );
}
