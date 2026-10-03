import { buttonVariants } from '@/_components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { EDUCATOR_PLAN_HREF } from '@/_lib/workoutLinks';
import type { MirrorWorkout } from '@/_types/professionalMirror';
import { Dumbbell } from 'lucide-react';
import Link from 'next/link';

interface MirrorWorkoutCardProps {
  workout: MirrorWorkout;
}

/**
 * The educator's current workout, read only: the title, how often, and the
 * sessions by name. No session is named as today's, because "today" only
 * exists through the schedule.
 */
export function MirrorWorkoutCard({ workout }: MirrorWorkoutCardProps) {
  return (
    <Card className="gap-3 border-line">
      <CardHeader className="grid-cols-[1fr_auto]">
        <CardTitle>Treino atual</CardTitle>
        <Dumbbell className="size-5 text-icon-accent" aria-hidden="true" />
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-3">
        <p className="font-medium">{workout.title}</p>
        {workout.weeklyFrequency !== null && (
          <p className="text-sm text-muted-foreground">
            {workout.weeklyFrequency}x por semana
          </p>
        )}
        <ul aria-label="Sessões do treino" className="flex flex-col gap-1">
          {workout.sessions.map(session => (
            <li key={session.id} className="text-sm">
              <span className="font-medium">Sessão {session.label}</span>
              {` — ${session.name}`}
            </li>
          ))}
        </ul>
        <Link
          href={EDUCATOR_PLAN_HREF}
          className={buttonVariants({ variant: 'outline' })}
        >
          Ver treino completo
        </Link>
      </CardContent>
    </Card>
  );
}
