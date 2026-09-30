import { ButtonLink } from '@/_components/ui/buttonLink';
import { Title } from '@/_components/ui/title';
import { DAY_LABELS } from '@/_enumerator/daysOfWeek';
import type { Exercise } from '@/_types/exercise';
import type { WorkoutExercise } from '@/_types/workout';
import FormExercise from './formExercise';
import { SafetyDisclaimer } from '../safetyDisclaimer';

interface FormWorkoutProps {
  workoutExerciseId: string;
  dayOfWeek: number;
  current: WorkoutExercise;
  canRemove: boolean;
  candidates: Exercise[];
}

export default function FormWorkout({
  workoutExerciseId,
  dayOfWeek,
  current,
  canRemove,
  candidates,
}: FormWorkoutProps) {
  return (
    <div className="flex flex-col w-full gap-4">
      <Title
        styled="form"
        label={`Editar exercício — ${DAY_LABELS[dayOfWeek] ?? `Dia ${dayOfWeek}`}`}
      >
        <ButtonLink
          variant="outline"
          url="/restrict/workouts"
          label="Voltar"
          className="w-32"
        />
      </Title>

      <FormExercise
        workoutExerciseId={workoutExerciseId}
        current={current}
        canRemove={canRemove}
        candidates={candidates}
      />

      <SafetyDisclaimer />
    </div>
  );
}
