import { buttonVariants } from '@/_components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { studentTabHref } from '@/_lib/studentsTabs';
import type { CurrentWorkoutSummary } from '@/_types/students';
import Link from 'next/link';
import { NewWorkoutDialog } from './newWorkoutDialog';

interface CurrentWorkoutCardProps {
  studentId: string;
  workout: CurrentWorkoutSummary | null;
}

/** "Treino atual" on the student overview: the active workout, or an honest empty state. */
export function CurrentWorkoutCard({
  studentId,
  workout,
}: CurrentWorkoutCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Treino atual</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-3">
        {workout ? (
          <>
            <p className="font-medium">{workout.title}</p>
            {workout.weeklyFrequency !== null && (
              <p className="text-sm text-muted-foreground">
                {workout.weeklyFrequency}x por semana
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Sessões: {workout.sessionNames.join(', ')}
            </p>
            <Link
              href={studentTabHref(studentId, 'workouts')}
              className={buttonVariants({ variant: 'outline' })}
            >
              Ver treinos
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Nenhum treino ativo para este aluno.
            </p>
            <NewWorkoutDialog studentId={studentId} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
