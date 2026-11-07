import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { buttonVariants } from '@/_components/ui/button';
import { ButtonLink } from '@/_components/ui/buttonLink';
import { Title } from '@/_components/ui/title';
import { DAY_LABELS } from '@/_enumerator/daysOfWeek';
import type { Workout, WorkoutDay } from '@/_types/workout';
import Link from 'next/link';
import { SafetyDisclaimer } from './safetyDisclaimer';

const GOAL_LABELS: Record<Workout['goal'], string> = {
  WEIGHT_LOSS: 'Emagrecimento',
  MUSCLE_GAIN: 'Ganho de massa',
  CONDITIONING: 'Condicionamento',
  MAINTENANCE: 'Manutenção',
};

interface GeneratedWorkoutViewProps {
  workout: Workout;
}

function WorkoutDayCard({ day }: { day: WorkoutDay }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {DAY_LABELS[day.dayOfWeek] ?? `Dia ${day.dayOfWeek}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2">
          {day.exercises.map(exercise => (
            <li
              key={exercise.id}
              className="flex items-center justify-between gap-2 rounded-md border border-line px-3 py-2"
            >
              <span>
                {exercise.exercise?.name ?? 'Exercício indisponível'}{' '}
                <span className="text-muted-foreground text-sm">
                  {exercise.sets}x{exercise.reps}
                </span>
              </span>
              <ButtonLink
                variant="link"
                url={`/restrict/workouts/${exercise.id}`}
                label="Editar"
              />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function WorkoutHeaderActions() {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/api/workouts/current/pdf"
        className={buttonVariants({ variant: 'outline' })}
      >
        Exportar PDF
      </Link>
      <ButtonLink
        variant="outline"
        url="/restrict/workouts?gerar=1"
        label="Gerar novo treino"
        className="w-full sm:w-auto"
      />
    </div>
  );
}

export function GeneratedWorkoutView({ workout }: GeneratedWorkoutViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <Title label={`Seu treino — ${GOAL_LABELS[workout.goal]}`}>
        <WorkoutHeaderActions />
      </Title>

      <p className="text-muted-foreground">{workout.explanation}</p>

      <div className="grid gap-4 md:grid-cols-2">
        {workout.days.map(day => (
          <WorkoutDayCard key={day.id} day={day} />
        ))}
      </div>

      <SafetyDisclaimer />
    </div>
  );
}
