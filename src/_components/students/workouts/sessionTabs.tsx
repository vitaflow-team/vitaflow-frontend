'use client';

import { cn } from '@/_lib/utils';
import { sessionLabel } from '@/_lib/workoutEditor';
import type { EditorSession } from '@/_types/workoutEditor';

interface SessionTabsProps {
  sessions: EditorSession[];
  activeKey: string | null;
  onSelect: (key: string) => void;
}

const TAB_CLASS =
  'inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 border-transparent px-3 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden';

/** One tab per session, labeled by position: A, B, C… */
export function SessionTabs({
  sessions,
  activeKey,
  onSelect,
}: SessionTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Sessões do treino"
      className="flex gap-1 overflow-x-auto border-b border-line"
    >
      {sessions.map((session, position) => (
        <button
          key={session.key}
          type="button"
          role="tab"
          id={`session-tab-${session.key}`}
          aria-selected={session.key === activeKey}
          aria-controls={`session-panel-${session.key}`}
          onClick={() => onSelect(session.key)}
          className={cn(
            TAB_CLASS,
            session.key === activeKey &&
              'border-primary font-semibold text-foreground'
          )}
        >
          <span aria-hidden="true">{sessionLabel(position)}</span>
          <span className="sr-only">Sessão {sessionLabel(position)}:</span>
          <span className="max-w-32 truncate">
            {session.name || 'Sem nome'}
          </span>
        </button>
      ))}
    </div>
  );
}
