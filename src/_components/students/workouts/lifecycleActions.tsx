'use client';

import { Button } from '@/_components/ui/button';
import type {
  ActivationProblem,
  WorkoutStatus,
} from '@/_types/educatorWorkouts';
import { Archive, Play } from 'lucide-react';
import { FormError } from '../formError';
import { ActivationProblems } from './activationProblems';
import { DeleteWorkoutDialog } from './deleteWorkoutDialog';

interface LifecycleActionsProps {
  title: string;
  status: WorkoutStatus;
  /** Unsaved changes: activation works on what is stored, so save first. */
  isDirty: boolean;
  isPending: boolean;
  error: string | null;
  problems: ActivationProblem[];
  onActivate: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
}

interface ToggleProps {
  isActive: boolean;
  isDirty: boolean;
  isPending: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

function ToggleButton({
  isActive,
  isDirty,
  isPending,
  onActivate,
  onDeactivate,
}: ToggleProps) {
  if (isActive) {
    return (
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={onDeactivate}
      >
        <Archive aria-hidden="true" />
        Desativar
      </Button>
    );
  }

  return (
    <Button
      type="button"
      disabled={isPending || isDirty}
      aria-describedby={isDirty ? 'activate-hint' : undefined}
      onClick={onActivate}
    >
      <Play aria-hidden="true" />
      Ativar
    </Button>
  );
}

/**
 * Activate (draft or archived), deactivate (active) and delete (draft or
 * archived, never the active one), with the reason when something fails.
 */
export function LifecycleActions({
  title,
  status,
  isDirty,
  isPending,
  error,
  problems,
  onActivate,
  onDeactivate,
  onDelete,
}: LifecycleActionsProps) {
  const isActive = status === 'ACTIVE';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <ToggleButton
          isActive={isActive}
          isDirty={isDirty}
          isPending={isPending}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
        />
        {!isActive && (
          <DeleteWorkoutDialog
            title={title}
            disabled={isPending}
            onConfirm={onDelete}
          />
        )}
      </div>
      {isDirty && !isActive && (
        <p id="activate-hint" className="text-xs text-muted-foreground">
          Salve as alterações antes de ativar o treino.
        </p>
      )}
      <ActivationProblems problems={problems} />
      <FormError message={error} />
    </div>
  );
}
