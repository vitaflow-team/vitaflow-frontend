import { Title } from '@/_components/ui/title';
import type { StudentEducatorWorkout } from '@/_types/educatorWorkouts';
import { EducatorExerciseItem } from './educatorExerciseItem';

interface EducatorWorkoutViewProps {
  item: StudentEducatorWorkout;
}

function anchorOf(label: string): string {
  return `sessao-${label.toLowerCase()}`;
}

function SessionLinks({
  sessions,
}: {
  sessions: StudentEducatorWorkout['workout']['sessions'];
}) {
  if (sessions.length < 2) return null;

  return (
    <nav aria-label="Sessões do treino" className="flex flex-wrap gap-2">
      {sessions.map(session => (
        <a
          key={session.id}
          href={`#${anchorOf(session.label)}`}
          className="inline-flex min-h-11 items-center rounded-md border border-line px-3 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
        >
          {session.label} — {session.name}
        </a>
      ))}
    </nav>
  );
}

/**
 * The workout the educator prescribed, read only. There is no edit control, no
 * conflict marker and no AI disclaimer: this is the educator's plan, not a
 * generated one.
 */
export function EducatorWorkoutView({ item }: EducatorWorkoutViewProps) {
  const { educator, workout } = item;

  return (
    <div className="flex flex-col gap-6">
      <Title label={workout.title} />
      <p className="text-sm text-muted-foreground">
        Treino de {educator.name}
        {workout.weeklyFrequency !== null
          ? ` · ${workout.weeklyFrequency}x por semana`
          : ''}
      </p>
      <SessionLinks sessions={workout.sessions} />
      {workout.sessions.map(session => (
        <section
          key={session.id}
          id={anchorOf(session.label)}
          aria-labelledby={`${anchorOf(session.label)}-title`}
          className="flex scroll-mt-20 flex-col"
        >
          <h2
            id={`${anchorOf(session.label)}-title`}
            className="text-lg font-semibold"
          >
            Sessão {session.label} — {session.name}
          </h2>
          <ul>
            {session.exercises.map((exercise, index) => (
              <EducatorExerciseItem
                key={`${session.id}-${index}`}
                exercise={exercise}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
