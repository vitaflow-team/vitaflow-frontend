'use client';

import { Button } from '@/_components/ui/button';
import type { EditorAction } from '@/_lib/workoutEditor';
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import type { Dispatch } from 'react';

const ICON_BUTTON = 'size-11 md:size-9';

interface ExerciseControlsProps {
  sessionKey: string;
  exerciseKey: string;
  name: string;
  index: number;
  total: number;
  dispatch: Dispatch<EditorAction>;
}

/** Move an exercise up or down inside its session, or remove it. */
export function ExerciseControls({
  sessionKey,
  exerciseKey,
  name,
  index,
  total,
  dispatch,
}: ExerciseControlsProps) {
  const move = (direction: -1 | 1) =>
    dispatch({ type: 'move-exercise', sessionKey, exerciseKey, direction });

  return (
    <div className="flex gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={ICON_BUTTON}
        disabled={index === 0}
        aria-label={`Mover ${name} para cima`}
        onClick={() => move(-1)}
      >
        <ArrowUp aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={ICON_BUTTON}
        disabled={index === total - 1}
        aria-label={`Mover ${name} para baixo`}
        onClick={() => move(1)}
      >
        <ArrowDown aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={ICON_BUTTON}
        aria-label={`Remover ${name}`}
        onClick={() =>
          dispatch({ type: 'remove-exercise', sessionKey, exerciseKey })
        }
      >
        <Trash2 aria-hidden="true" />
      </Button>
    </div>
  );
}
