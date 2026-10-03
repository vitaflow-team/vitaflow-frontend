import { CONTRAINDICATION_LABELS } from '@/_constants/exerciseCatalog';
import type { ExerciseContraindication } from '@/_types/exerciseContraindication';
import { TriangleAlert } from 'lucide-react';

/** "Joelho e Coluna": the student's restrictions an exercise runs into. */
export function conflictLabels(conflicts: ExerciseContraindication[]): string {
  const names = conflicts.map(value => CONTRAINDICATION_LABELS[value]);
  return names.length > 1
    ? `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`
    : (names[0] ?? '');
}

interface ConflictMarkerProps {
  conflicts: ExerciseContraindication[];
}

/**
 * The persistent marker on an exercise that conflicts with a restriction of
 * the student: an icon and words, never color alone. It warns; it never blocks.
 */
export function ConflictMarker({ conflicts }: ConflictMarkerProps) {
  if (conflicts.length === 0) return null;

  return (
    <p className="inline-flex items-center gap-1 rounded-md border border-warn px-2 py-0.5 text-xs font-medium">
      <TriangleAlert className="size-3" aria-hidden="true" />
      Atenção: restrição do aluno — {conflictLabels(conflicts)}
    </p>
  );
}
