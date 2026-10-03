import { Button } from '@/_components/ui/button';
import type { ExerciseContraindication } from '@/_types/exerciseContraindication';
import { TriangleAlert } from 'lucide-react';
import { conflictLabels } from './conflictMarker';

interface ConflictWarningProps {
  exerciseName: string;
  conflicts: ExerciseContraindication[];
  onDismiss: () => void;
}

/**
 * Shown right after adding a library exercise that runs into a restriction the
 * student registered. It informs; the exercise stays and nothing is blocked.
 */
export function ConflictWarning({
  exerciseName,
  conflicts,
  onDismiss,
}: ConflictWarningProps) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-2 rounded-md border border-warn p-3 text-sm"
    >
      <p className="flex items-start gap-2 font-medium">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          {exerciseName} pode não ser indicado para este aluno: ele registrou
          restrição em {conflictLabels(conflicts)}. Você pode mantê-lo no
          treino.
        </span>
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={onDismiss}
      >
        Entendi
      </Button>
    </div>
  );
}
