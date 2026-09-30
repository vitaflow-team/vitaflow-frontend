import { equipmentLabel } from '@/_lib/exerciseDisplay';
import type { Exercise } from '@/_types/exercise';

interface ExerciseFactsProps {
  exercise: Exercise;
}

function musclesText(muscles: string[]): string | null {
  return muscles.length > 0 ? muscles.join(', ') : null;
}

/** Muscle group, level, equipment and muscles worked (US-004.AC-4). */
export function ExerciseFacts({ exercise }: ExerciseFactsProps) {
  const facts: Array<[string, string | null]> = [
    ['Grupo muscular', exercise.muscleGroup],
    ['Nível', exercise.difficulty],
    ['Equipamento', equipmentLabel(exercise.equipment)],
    ['Músculos principais', musclesText(exercise.primaryMuscles)],
    ['Músculos secundários', musclesText(exercise.secondaryMuscles)],
  ];

  return (
    <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
      {facts
        .filter(([, value]) => value !== null)
        .map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-muted-foreground text-sm">{label}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
    </dl>
  );
}
