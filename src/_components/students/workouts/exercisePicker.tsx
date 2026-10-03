'use client';

import { Button } from '@/_components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/_components/ui/dialog';
import { useExercisePick } from '@/_hooks/useExercisePick';
import type { EditorExercise } from '@/_types/workoutEditor';
import { Plus } from 'lucide-react';
import { ExercisePickerContent } from './exercisePickerContent';

interface ExercisePickerProps {
  studentId: string;
  disabled: boolean;
  /** Why adding is disabled (the session is full); shown beside the button. */
  disabledReason?: string;
  onAdd: (exercise: EditorExercise) => void;
}

/** Adds an exercise from the approved library (searching by name) or by a free name. */
export function ExercisePicker({
  studentId,
  disabled,
  disabledReason,
  onAdd,
}: ExercisePickerProps) {
  const pick = useExercisePick(studentId, onAdd);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Dialog open={pick.open} onOpenChange={pick.setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            aria-describedby={disabled ? 'exercises-limit' : undefined}
          >
            <Plus aria-hidden="true" />
            Adicionar exercício
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <ExercisePickerContent
            query={pick.query}
            freeName={pick.freeName}
            search={pick.search}
            isPicking={pick.isPicking}
            onQueryChange={pick.setQuery}
            onFreeNameChange={pick.setFreeName}
            onPickLibrary={library => void pick.pickLibrary(library)}
            onPickFree={pick.pickFree}
          />
        </DialogContent>
      </Dialog>
      {disabled && disabledReason && (
        <p id="exercises-limit" className="text-xs text-muted-foreground">
          {disabledReason}
        </p>
      )}
    </div>
  );
}
