'use client';

import { Button } from '@/_components/ui/button';
import type { EditorAction } from '@/_lib/workoutEditor';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Dispatch } from 'react';
import { RemoveSessionDialog } from './removeSessionDialog';

interface SessionToolbarProps {
  sessionKey: string;
  label: string;
  name: string;
  exerciseCount: number;
  position: number;
  total: number;
  dispatch: Dispatch<EditorAction>;
}

/** Move the session before or after its neighbours, or remove it. */
export function SessionToolbar({
  sessionKey,
  label,
  name,
  exerciseCount,
  position,
  total,
  dispatch,
}: SessionToolbarProps) {
  const move = (direction: -1 | 1) =>
    dispatch({ type: 'move-session', sessionKey, direction });

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={position === 0}
        onClick={() => move(-1)}
      >
        <ArrowLeft aria-hidden="true" />
        Mover para antes
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={position === total - 1}
        onClick={() => move(1)}
      >
        Mover para depois
        <ArrowRight aria-hidden="true" />
      </Button>
      <RemoveSessionDialog
        label={label}
        name={name}
        exerciseCount={exerciseCount}
        onConfirm={() => dispatch({ type: 'remove-session', sessionKey })}
      />
    </div>
  );
}
